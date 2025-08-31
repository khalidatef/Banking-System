import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { Transaction } from '../../models/transaction';
import { Account } from '../../models/Account';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-fund-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fund-transfer.component.html',
  styleUrls: ['./fund-transfer.component.css'],
})
export class FundTransferComponent {
  // form fields
  transfer = {
    fromAccountNo: '',
    toAccountNo: '',
    amount: 0,
    description: '',
  };

  userAccounts: Account[] = [];
  transactions: Transaction[] = [];

  constructor(
    private accountService: AccountService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.getbalance();
  }
  getbalance(): void {
    const username = this.auth.getUsername();
    if (!username) return;

    this.accountService.getAccountForUser(username).subscribe((acc) => {
      if (acc) {
        this.userAccounts = [acc];
        this.transfer.fromAccountNo = acc.accountNo;

        this.accountService
          .getTransactionsByAccountNo(acc.accountNo)
          .subscribe((tx) => (this.transactions = tx));
      }
    });
  }

  // Main
  transferFunds() {
    if (
      !this.transfer.fromAccountNo ||
      !this.transfer.toAccountNo ||
      !this.transfer.amount ||
      this.transfer.amount <= 0
    ) {
      alert('Please fill in all fields');
      return;
    }

    this.getAccountByNo(this.transfer.fromAccountNo).subscribe((sender) => {
      this.getAccountByNo(this.transfer.toAccountNo).subscribe((receiver) => {
        if (!sender || !receiver) {
          alert('Invalid accounts');
          return;
        }

        if (sender.balance < this.transfer.amount) {
          alert('Insufficient funds ❌');
          return;
        }

        this.updateBalances(sender, receiver, this.transfer.amount);
      });
    });
  }

  getAccountByNo(accountNo: string): Observable<Account | undefined> {
    return this.accountService
      .getAccounts()
      .pipe(
        map((accounts) => accounts.find((acc) => acc.accountNo === accountNo))
      );
  }

  updateBalances(sender: Account, receiver: Account, amount: number) {
    sender.balance -= amount;
    receiver.balance += amount;

    this.accountService.updateAccount(sender).subscribe(() => {
      this.accountService.updateAccount(receiver).subscribe(() => {
        this.recordTransaction(
          sender.accountNo,
          receiver.accountNo,
          amount,
          this.transfer.description
        );
        alert('✅ Transfer successful');
        this.getbalance();
        // reset form
        this.transfer.toAccountNo = '';
        this.transfer.amount = 0;
        this.transfer.description = '';
      });
    });
  }

  recordTransaction(from: string, to: string, amount: number, desc: string) {
    const newTx: Omit<Transaction, 'id'> = {
      fromAccountNo: from,
      ToAccountNo: to,
      amount,
      description: desc,
      date: new Date().toISOString(),
      type: 'Debit',
    };

    this.accountService.addTransaction(newTx).subscribe({
      next: (tx) => this.transactions.push(tx),
      error: (err) =>
        console.error('Transaction POST failed:', alert(' Transfer failed ❌')),
    });

    console.log('Transaction payload:', newTx);
  }
}
