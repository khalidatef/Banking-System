import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: Date;
  type: 'Credit' | 'Debit';
  category: string;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit {
  searchQuery = '';
  selectedType = 'All Types';
  
  allTransactions: Transaction[] = [
    {
      id: 1001,
      description: 'Salary Credit - Bank Masr',
      amount: 5000.00,
      date: new Date('2025-01-29T09:30:00'),
      type: 'Credit',
      category: 'Salary'
    },
    {
      id: 1002,
      description: 'Online Shopping - Amazon',
      amount: 250.75,
      date: new Date('2025-01-28T14:22:00'),
      type: 'Debit',
      category: 'Shopping'
    },
    {
      id: 1003,
      description: 'Freelance Payment - Upwork',
      amount: 1200.00,
      date: new Date('2025-01-27T11:45:00'),
      type: 'Credit',
      category: 'Freelance'
    },
    {
      id: 1004,
      description: 'Grocery Store - Carrefour',
      amount: 180.50,
      date: new Date('2025-01-26T16:15:00'),
      type: 'Debit',
      category: 'Groceries'
    },
    {
      id: 1005,
      description: 'Transfer from Ahmed Mohamed',
      amount: 500.00,
      date: new Date('2025-01-25T10:30:00'),
      type: 'Credit',
      category: 'Transfer'
    },
    {
      id: 1006,
      description: 'Utility Bill - Electricity',
      amount: 120.25,
      date: new Date('2025-01-24T08:00:00'),
      type: 'Debit',
      category: 'Utilities'
    },
    {
      id: 1007,
      description: 'Investment Return',
      amount: 300.00,
      date: new Date('2025-01-23T12:00:00'),
      type: 'Credit',
      category: 'Investment'
    },
    {
      id: 1008,
      description: 'Restaurant - Pizza Hut',
      amount: 85.00,
      date: new Date('2025-01-22T19:30:00'),
      type: 'Debit',
      category: 'Dining'
    },
    {
      id: 1009,
      description: 'Bonus Payment',
      amount: 1500.00,
      date: new Date('2025-01-21T09:00:00'),
      type: 'Credit',
      category: 'Bonus'
    },
    {
      id: 1010,
      description: 'Gas Station - Shell',
      amount: 45.60,
      date: new Date('2025-01-20T07:45:00'),
      type: 'Debit',
      category: 'Transportation'
    },
    {
      id: 1011,
      description: 'ATM Withdrawal',
      amount: 200.00,
      date: new Date('2025-01-19T15:20:00'),
      type: 'Debit',
      category: 'Cash'
    },
    {
      id: 1012,
      description: 'Dividend Payment',
      amount: 75.00,
      date: new Date('2025-01-18T10:15:00'),
      type: 'Credit',
      category: 'Investment'
    }
  ];
  
  filteredTransactions: Transaction[] = [];
  transactionTypes = ['All Types', 'Credit', 'Debit'];

  ngOnInit(): void {
    this.filteredTransactions = this.allTransactions;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onTypeChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = this.allTransactions;
    
    // Filter by search query
    if (this.searchQuery.trim()) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    
    // Filter by type
    if (this.selectedType !== 'All Types') {
      filtered = filtered.filter(transaction => transaction.type === this.selectedType);
    }
    
    this.filteredTransactions = filtered;
  }

  getTransactionIcon(type: string): string {
    return type === 'Credit' ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
  }

  getTransactionClass(type: string): string {
    return type === 'Credit' ? 'credit-transaction' : 'debit-transaction';
  }

  getBadgeClass(type: string): string {
    return type === 'Credit' ? 'badge-credit' : 'badge-debit';
  }

  formatAmount(amount: number, type: string): string {
    const sign = type === 'Credit' ? '+' : '-';
    return `${sign}$${amount.toFixed(2)}`;
  }

  trackByTransactionId(index: number, transaction: Transaction): number {
    return transaction.id;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedType = 'All Types';
    this.applyFilters();
  }
}
