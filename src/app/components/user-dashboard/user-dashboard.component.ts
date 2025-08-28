import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuickActionCardComponent } from '../quick-action-card/quick-action-card.component';
import { StatWidgetComponent } from '../stat-widget/stat-widget.component';

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
export class UserDashboardComponent implements OnInit {
  quickActions: QuickAction[] = [
    { title: 'Transfer Money', icon: 'fas fa-exchange-alt', link: '/user/fund-transfer', color: 'primary' },
    { title: 'View Transactions', icon: 'fas fa-list', link: '/user/transactions', color: 'success' },
    { title: 'My Account', icon: 'fas fa-user-circle', link: '/user/myAccount', color: 'info' },
    { title: 'Customer Support', icon: 'fas fa-headset', link: '/user/support', color: 'warning' }
  ];

  accountStats: AccountStat[] = [
    { label: 'Total Balance', value: '45,250.00', icon: 'fas fa-wallet', color: 'primary', currency: 'EGP' },
    { label: 'Monthly Income', value: '8,500.00', icon: 'fas fa-arrow-up', color: 'success', currency: 'EGP' },
    { label: 'Monthly Expenses', value: '3,200.00', icon: 'fas fa-arrow-down', color: 'danger', currency: 'EGP' }
  ];

  recentTransactions: Transaction[] = [
    { type: 'Credit', amount: 2500.00, description: 'Salary Credit', date: new Date(2025, 0, 28) },
    { type: 'Debit', amount: 150.00, description: 'Online Shopping', date: new Date(2025, 0, 27) },
    { type: 'Transfer', amount: 500.00, description: 'To Ahmed Mohamed', date: new Date(2025, 0, 26) },
    { type: 'Credit', amount: 1200.00, description: 'Freelance Payment', date: new Date(2025, 0, 25) }
  ];

  userName = 'Ahmed';

  ngOnInit(): void {
    // Initialize component data
    console.log('User dashboard initialized');
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
}
