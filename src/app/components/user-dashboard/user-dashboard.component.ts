import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { QuickActionCardComponent } from '../quick-action-card/quick-action-card.component';
import { StatWidgetComponent } from '../stat-widget/stat-widget.component';
import { MockDataService, Transaction as MockTransaction } from '../../services/mock-data.service';
import { AuthService } from '../../services/auth.service';

interface QuickAction {
  title: string;
  icon: string;
  link: string;
  color: string;
}

interface AccountStat {
  label: string;
  value: string;
  icon: string;
  color: string;
  currency?: string;
}

interface Transaction {
  type: string;
  amount: number;
  description: string;
  date: Date;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, QuickActionCardComponent, StatWidgetComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  quickActions: QuickAction[] = [
    { title: 'Transfer Money', icon: 'fas fa-exchange-alt', link: '/user/fund-transfer', color: 'primary' },
    { title: 'View Transactions', icon: 'fas fa-list', link: '/user/transactions', color: 'success' },
    { title: 'My Account', icon: 'fas fa-user-circle', link: '/user/myAccount', color: 'info' },
    { title: 'Customer Support', icon: 'fas fa-headset', link: '/user/support', color: 'warning' }
  ];

  accountStats: AccountStat[] = [];
  recentTransactions: Transaction[] = [];
  userName = 'User';
  isLoading = true;
  
  constructor(
    private mockDataService: MockDataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserData(): void {
    const currentUserId = this.authService.getCurrentUserId();
    
    if (!currentUserId) {
      console.warn('No current user found');
      this.isLoading = false;
      return;
    }

    // Load user name
    this.userName = this.authService.getCurrentUserDisplayName();

    // Load account statistics and recent transactions
    combineLatest([
      this.mockDataService.getAccountStatistics(currentUserId),
      this.mockDataService.getTransactionsByUserId(currentUserId),
      this.mockDataService.getTransactionStatistics(currentUserId)
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ([accountStats, transactions, transactionStats]) => {
        this.updateAccountStats(accountStats, transactionStats);
        this.updateRecentTransactions(transactions.slice(0, 5)); // Show only first 5
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.loadFallbackData();
        this.isLoading = false;
      }
    });
  }

  private updateAccountStats(accountStats: any, transactionStats: any): void {
    const totalBalance = accountStats.totalBalance || 0;
    const monthlyTransactions = transactionStats.monthlyTransactions || 0;
    const totalCredits = transactionStats.totalCredits || 0;
    const totalDebits = transactionStats.totalDebits || 0;
    
    this.accountStats = [
      { 
        label: 'Total Balance', 
        value: this.mockDataService.formatCurrency(totalBalance).replace('EGP', '').trim(), 
        icon: 'fas fa-wallet', 
        color: 'primary', 
        currency: 'EGP' 
      },
      { 
        label: 'Monthly Transactions', 
        value: monthlyTransactions.toString(), 
        icon: 'fas fa-exchange-alt', 
        color: 'info'
      },
      { 
        label: 'Credit Transactions', 
        value: totalCredits.toString(), 
        icon: 'fas fa-arrow-down', 
        color: 'success'
      },
      { 
        label: 'Debit Transactions', 
        value: totalDebits.toString(), 
        icon: 'fas fa-arrow-up', 
        color: 'warning'
      }
    ];
  }

  private updateRecentTransactions(mockTransactions: MockTransaction[]): void {
    this.recentTransactions = mockTransactions.map(tx => ({
      type: tx.type,
      amount: tx.amount,
      description: tx.description,
      date: new Date(tx.date)
    }));
  }

  private loadFallbackData(): void {
    // Fallback to static data if API fails
    this.accountStats = [
      { label: 'Total Balance', value: '45,250.00', icon: 'fas fa-wallet', color: 'primary', currency: 'EGP' },
      { label: 'Monthly Transactions', value: '12', icon: 'fas fa-exchange-alt', color: 'info' },
      { label: 'Credit Transactions', value: '8', icon: 'fas fa-arrow-down', color: 'success' },
      { label: 'Debit Transactions', value: '4', icon: 'fas fa-arrow-up', color: 'warning' }
    ];

    this.recentTransactions = [
      { type: 'Credit', amount: 2500.00, description: 'Salary Credit', date: new Date(2025, 0, 28) },
      { type: 'Debit', amount: 150.00, description: 'Online Shopping', date: new Date(2025, 0, 27) },
      { type: 'Transfer', amount: 500.00, description: 'To Ahmed Mohamed', date: new Date(2025, 0, 26) },
      { type: 'Credit', amount: 1200.00, description: 'Freelance Payment', date: new Date(2025, 0, 25) }
    ];
  }

  getTransactionIcon(type: string): string {
    switch (type) {
      case 'Credit': return 'fas fa-arrow-down text-success';
      case 'Debit': return 'fas fa-arrow-up text-danger';
      case 'Transfer': return 'fas fa-exchange-alt text-info';
      default: return 'fas fa-circle';
    }
  }

  getTransactionColor(type: string): string {
    switch (type) {
      case 'Credit': return 'text-success';
      case 'Debit': return 'text-danger';
      case 'Transfer': return 'text-info';
      default: return 'text-muted';
    }
  }

  getTransactionTypeClass(type: string): string {
    switch (type) {
      case 'Credit': return 'credit';
      case 'Debit': return 'debit';
      case 'Transfer': return 'transfer';
      default: return 'default';
    }
  }
}
