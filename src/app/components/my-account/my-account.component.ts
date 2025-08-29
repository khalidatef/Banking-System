import { Component } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/Account'; 
import { Transaction } from '../../models/transaction';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { users } from '../../data/mock-users';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent {
  username = '';
  account: Account | null = null;
  transactions: Transaction[] = [];

  constructor(
    private auth: AuthService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.username = this.auth.getUsername() ?? '';
    this.loadAccount();
  }
  

loadAccount(): void {
  if (!this.username) return;

  this.accountService.getAccountForUser(this.username).subscribe(acc => {
    this.account = acc;
    if (this.account) {
      this.loadTransactions(this.account.accountNo);
    }
  });
}


  loadTransactions(accountNo: string) {
  this.accountService.getTransactionsByAccountNo(accountNo).subscribe(txs => {
    this.transactions = txs;
  });
}

}
