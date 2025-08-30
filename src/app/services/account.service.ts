import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Account, AccountType } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly baseUrl = 'https://68a063076e38a02c58188d9c.mockapi.io/bankingsystem';
  private userAccountSubject = new BehaviorSubject<Account | null>(null);
  public userAccount$ = this.userAccountSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get all accounts
   */
  getAllAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}/Account`);
  }

  /**
   * Get account by ID
   */
  getAccountById(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}/Account/${id}`);
  }

  /**
   * Get account by user ID
   */
  getAccountByUserId(userId: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}/Account?userId=${userId}`);
  }

  /**
   * Get account by account number
   */
  getAccountByNumber(accountNo: string): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}/Account?accountNo=${accountNo}`);
  }

  /**
   * Create new account
   */
  createAccount(account: Omit<Account, 'id'>): Observable<Account> {
    return this.http.post<Account>(`${this.baseUrl}/Account`, account);
  }

  /**
   * Update account
   */
  updateAccount(id: number, account: Partial<Account>): Observable<Account> {
    return this.http.put<Account>(`${this.baseUrl}/Account/${id}`, account);
  }

  /**
   * Delete account
   */
  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Account/${id}`);
  }

  /**
   * Update account balance
   */
  updateAccountBalance(accountNo: string, newBalance: number): Observable<Account> {
    // First get the account by account number to get the ID
    return new Observable(observer => {
      this.getAccountByNumber(accountNo).subscribe({
        next: (accounts) => {
          if (accounts && accounts.length > 0) {
            const account = accounts[0];
            this.updateAccount(account.id, { balance: newBalance }).subscribe({
              next: (updatedAccount) => {
                observer.next(updatedAccount);
                observer.complete();
              },
              error: (error) => observer.error(error)
            });
          } else {
            observer.error(new Error('Account not found'));
          }
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Generate account number
   */
  generateAccountNumber(accountType: AccountType): string {
    const prefix = accountType === AccountType.Savings ? 'SAV' : 'CUR';
    const random = Math.floor(Math.random() * 1000000000).toString().padStart(10, '0');
    return `${prefix}${random}`;
  }

  /**
   * Set current user account
   */
  setUserAccount(account: Account): void {
    this.userAccountSubject.next(account);
  }

  /**
   * Get current user account
   */
  getUserAccount(): Account | null {
    return this.userAccountSubject.value;
  }

  /**
   * Clear user account data
   */
  clearUserAccount(): void {
    this.userAccountSubject.next(null);
  }
}
