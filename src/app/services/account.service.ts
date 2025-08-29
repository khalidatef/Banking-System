import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/Account';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl = 'https://68a063076e38a02c58188d9c.mockapi.io/bankingsystem';

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}/Account`);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/Transaction`);
  }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/Transaction`, transaction);
  }
}