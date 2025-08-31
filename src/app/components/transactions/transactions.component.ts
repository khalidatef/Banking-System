import { Component } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Transaction } from '../../models/transaction';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionFilterPipe } from '../../pipes/transaction-filter.pipe';
import { TransactionType } from '../../models/TransactionType';
import { HttpClientModule } from '@angular/common/http';
import { MyAccountComponent } from '../my-account/my-account.component';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, TransactionFilterPipe],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredType: string = 'All';
  searchTerm: string = '';
  transactionTypes = ['All', TransactionType.Credit, TransactionType.Debit];
  accountNo: string | null = null;

  constructor(private accountService: AccountService, private auth: AuthService) {}

  ngOnInit() {
  const username = this.auth.getUsername();
  if (!username) return;

  this.accountService.getAccountForUser(username).subscribe(acc => {
    if (acc) {
      this.accountNo = acc.accountNo;
      this.accountService.getTransactionsByAccountNo(acc.accountNo)
      .subscribe(tx => {
      this.transactions = tx.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

    }
  });
}

}