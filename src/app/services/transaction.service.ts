import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Transaction } from '../models';
import { TransactionType } from '../enums';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly baseUrl = 'https://68a063076e38a02c58188d9c.mockapi.io/bankingsystem';
  private userTransactionsSubject = new BehaviorSubject<Transaction[]>([]);
  public userTransactions$ = this.userTransactionsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get all transactions
   */
  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/Transaction`);
  }

  /**
   * Get transaction by ID
   */
  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}/Transaction/${id}`);
  }

  /**
   * Get transactions by account number
   */
  getTransactionsByAccount(accountNo: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/Transaction?fromAccountNo=${accountNo}`);
  }

  /**
   * Create new transaction
   */
  createTransaction(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
    const transactionData = {
      ...transaction,
      date: new Date().toISOString()
    };
    return this.http.post<Transaction>(`${this.baseUrl}/Transaction`, transactionData);
  }

  /**
   * Update transaction
   */
  updateTransaction(id: number, transaction: Partial<Transaction>): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.baseUrl}/Transaction/${id}`, transaction);
  }

  /**
   * Delete transaction
   */
  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Transaction/${id}`);
  }

  /**
   * Transfer funds between accounts
   */
  transferFunds(fromAccount: string, toAccount: string, amount: number, description: string): Observable<{
    success: boolean;
    debitTransaction?: Transaction;
    creditTransaction?: Transaction;
    message?: string;
  }> {
    return new Observable(observer => {
      // Create debit transaction for sender
      const debitTransaction: Omit<Transaction, 'id'> = {
        fromAccountNo: fromAccount,
        ToAccountNo: toAccount,
        date: new Date(),
        amount: amount,
        type: TransactionType.Debit,
        description: description
      };

      // Create credit transaction for receiver  
      const creditTransaction: Omit<Transaction, 'id'> = {
        fromAccountNo: toAccount,
        ToAccountNo: fromAccount,
        date: new Date(),
        amount: amount,
        type: TransactionType.Credit,
        description: `Received from ${fromAccount}`
      };

      // Create both transactions
      this.createTransaction(debitTransaction).subscribe({
        next: (debit) => {
          this.createTransaction(creditTransaction).subscribe({
            next: (credit) => {
              observer.next({
                success: true,
                debitTransaction: debit,
                creditTransaction: credit
              });
              observer.complete();
            },
            error: (error) => {
              observer.next({
                success: false,
                message: 'Failed to create credit transaction'
              });
              observer.complete();
            }
          });
        },
        error: (error) => {
          observer.next({
            success: false,
            message: 'Failed to create debit transaction'
          });
          observer.complete();
        }
      });
    });
  }

  /**
   * Get user's recent transactions
   */
  getUserRecentTransactions(accountNo: string, limit: number = 10): Observable<Transaction[]> {
    return new Observable(observer => {
      this.getAllTransactions().subscribe({
        next: (transactions) => {
          const userTransactions = transactions
            .filter(t => t.fromAccountNo === accountNo || t.ToAccountNo === accountNo)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, limit);
          
          this.userTransactionsSubject.next(userTransactions);
          observer.next(userTransactions);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Filter transactions by type
   */
  filterTransactionsByType(transactions: Transaction[], type: TransactionType): Transaction[] {
    return transactions.filter(t => t.type === type);
  }

  /**
   * Search transactions by description
   */
  searchTransactionsByDescription(transactions: Transaction[], searchTerm: string): Transaction[] {
    return transactions.filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  /**
   * Get transaction statistics
   */
  getTransactionStats(accountNo: string): Observable<{
    totalCredits: number;
    totalDebits: number;
    monthlyIncome: number;
    monthlyExpenses: number;
  }> {
    return new Observable(observer => {
      this.getTransactionsByAccount(accountNo).subscribe({
        next: (transactions) => {
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          
          const stats = transactions.reduce((acc, transaction) => {
            const transactionDate = new Date(transaction.date);
            const isCurrentMonth = transactionDate.getMonth() === currentMonth && 
                                  transactionDate.getFullYear() === currentYear;
            
            if (transaction.type === TransactionType.Credit) {
              acc.totalCredits += transaction.amount;
              if (isCurrentMonth) {
                acc.monthlyIncome += transaction.amount;
              }
            } else {
              acc.totalDebits += transaction.amount;
              if (isCurrentMonth) {
                acc.monthlyExpenses += transaction.amount;
              }
            }
            return acc;
          }, {
            totalCredits: 0,
            totalDebits: 0,
            monthlyIncome: 0,
            monthlyExpenses: 0
          });

          observer.next(stats);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Set user transactions
   */
  setUserTransactions(transactions: Transaction[]): void {
    this.userTransactionsSubject.next(transactions);
  }

  /**
   * Get current user transactions
   */
  getUserTransactions(): Transaction[] {
    return this.userTransactionsSubject.value;
  }

  /**
   * Clear user transactions
   */
  clearUserTransactions(): void {
    this.userTransactionsSubject.next([]);
  }
}
