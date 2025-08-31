import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { Transaction } from '../../models/transaction';
import { TransactionType } from '../../models/TransactionType';
import { Account } from '../../models/Account';
import { AccountType } from '../../models/AccountType';

@Component({
  selector: 'app-fund-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fund-transfer.component.html',
  styleUrls: ['./fund-transfer.component.css']
})
export class FundTransferComponent {
  transfer = {
    fromAccountNo: '',
    toAccountNo: '',
    amount: 0,
    description: ''
  };

  userAccounts: Account[] = [];
  transactions: Transaction[] = [];

  constructor(
    private accountService: AccountService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const username = this.auth.getUsername();
    if (!username) return;

    this.accountService.getAccountForUser(username).subscribe(acc => {
      if (acc) {
        this.userAccounts = [acc];
        this.transfer.fromAccountNo = acc.accountNo;

        this.accountService.getTransactionsByAccountNo(acc.accountNo)
          .subscribe(tx => this.transactions = tx);
      }
    });
  }

  // --- helper methods ---
  private createTransaction(): Transaction {
    return {
      id: Date.now().toString(),
      fromAccountNo: this.transfer.fromAccountNo,
      ToAccountNo: this.transfer.toAccountNo,
      amount: this.transfer.amount,
      description: this.transfer.description,
      date: new Date(),
      type: TransactionType.Debit
    };
  }

  private updateSenderBalance(amount: number) {
    const senderAcc = this.userAccounts[0];
    senderAcc.balance -= amount;
    return this.accountService.updateAccount(senderAcc);
  }

  private updateReceiverBalance(amount: number) {
    this.accountService.getAccounts().subscribe(accounts => {
      const receiverAcc = accounts.find(a => a.accountNo === this.transfer.toAccountNo);
      if (receiverAcc) {
        receiverAcc.balance += amount;
        this.accountService.updateAccount(receiverAcc).subscribe();
      }
    });
  }

  private resetForm() {
    this.transfer.toAccountNo = '';
    this.transfer.amount = 0;
    this.transfer.description = '';
  }

  // --- main method ---
  transferFunds() {
    if (!this.transfer.toAccountNo || !this.transfer.amount) return;

    // 1) Create and push transaction
    const newTx = this.createTransaction();
    this.transactions.push(newTx);
    this.accountService.addTransaction(newTx).subscribe();

    // 2) Update balances
    this.updateSenderBalance(this.transfer.amount).subscribe(() => {
      this.updateReceiverBalance(this.transfer.amount);
    });

    // 3) Reset form
    this.resetForm();
  }
}
