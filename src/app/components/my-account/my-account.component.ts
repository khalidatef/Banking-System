import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Transaction {
  type: string;
  description: string;
  amount: number;
  date: Date;
  category: 'Credit' | 'Debit';
}

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent implements OnInit {
  accountNumber = 'ACC001';
  accountType = 'Savings';
  currentBalance = 5000.00;
  
  recentTransactions: Transaction[] = [
    {
      type: 'Salary deposit',
      description: 'Salary deposit',
      amount: 1000.00,
      date: new Date('2024-01-15'),
      category: 'Credit'
    },
    {
      type: 'Grocery shopping',
      description: 'Grocery shopping',
      amount: 250.00,
      date: new Date('2024-01-14'),
      category: 'Debit'
    },
    {
      type: 'Freelance payment',
      description: 'Freelance payment',
      amount: 500.00,
      date: new Date('2024-01-13'),
      category: 'Credit'
    }
  ];

  ngOnInit(): void {
    console.log('My Account component initialized');
  }

  getTransactionIcon(category: string): string {
    return category === 'Credit' ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
  }

  getTransactionClass(category: string): string {
    return category === 'Credit' ? 'credit-transaction' : 'debit-transaction';
  }

  formatAmount(amount: number, category: string): string {
    const sign = category === 'Credit' ? '+' : '-';
    return `${sign}$${amount.toFixed(2)}`;
  }

  trackByTransactionId(index: number, transaction: Transaction): number {
    return index; // Since our Transaction interface doesn't have id, use index
  }
}
