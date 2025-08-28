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
      id: 1,
      description: 'Salary deposit',
      amount: 1000.00,
      date: new Date('2024-01-15'),
      type: 'Credit',
      category: 'Income'
    },
    {
      id: 2,
      description: 'Grocery shopping',
      amount: 250.00,
      date: new Date('2024-01-14'),
      type: 'Debit',
      category: 'Shopping'
    },
    {
      id: 3,
      description: 'Freelance payment',
      amount: 500.00,
      date: new Date('2024-01-13'),
      type: 'Credit',
      category: 'Income'
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
