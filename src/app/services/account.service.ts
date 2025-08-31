import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/Account';
import { Transaction } from '../models/transaction';
import { map } from 'rxjs/operators';
import { users } from '../data/mock-users';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl = 'https://68a063076e38a02c58188d9c.mockapi.io/bankingsystem';

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}/Account`);
  }

  updateAccount(account: Account): Observable<Account> {
    return this.http.put<Account>(`${this.baseUrl}/Account/${account.id}`, account);
  }

  getAccountById(id: string): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}/Account/${id}`);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/Transaction`);
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
  return this.http.post<Transaction>(`${this.baseUrl}/Transaction`, transaction, {
    headers: { 'Content-Type': 'application/json' }
  });
}



  getTransactionsByAccountNo(accountNo: string): Observable<Transaction[]> {
  return this.http.get<Transaction[]>(`${this.baseUrl}/Transaction`).pipe(
    map(allTx => allTx.filter(
      t => t.fromAccountNo === accountNo || t.ToAccountNo === accountNo
    ))
  );
}

getAccountForUser(username: string): Observable<Account | null> {
  return this.getAccounts().pipe(
    map(accounts => {
      const user = users.find(u => u.username === username);
      if (!user) return null;
      return accounts.find(a => a.userId === Number(user.id)) ?? null;
    })
  );
}

}