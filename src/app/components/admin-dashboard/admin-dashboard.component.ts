import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { QuickActionCardComponent } from '../quick-action-card/quick-action-card.component';
import { StatWidgetComponent } from '../stat-widget/stat-widget.component';
import { MockDataService, Transaction as MockTransaction, User as MockUser, Account as MockAccount } from '../../services/mock-data.service';
import { AuthService } from '../../services/auth.service';

interface AdminAction {
  title: string;
  icon: string;
  link: string;
  color: string;
  description: string;
}

interface SystemStat {
  label: string;
  value: string;
  icon: string;
  color: string;
  trend?: string;
  change?: string;
}

interface RecentActivity {
  type: 'user' | 'transaction' | 'account' | 'system';
  title: string;
  description: string;
  time: Date;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, QuickActionCardComponent, StatWidgetComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  adminActions: AdminAction[] = [
    { 
      title: 'User Management', 
      icon: 'fas fa-users', 
      link: '/admin/users', 
      color: 'primary',
      description: 'Manage user accounts and permissions'
    },
    { 
      title: 'Account Overview', 
      icon: 'fas fa-university', 
      link: '/admin/accounts', 
      color: 'success',
      description: 'View and manage all bank accounts'
    },
    { 
      title: 'Transaction Monitor', 
      icon: 'fas fa-exchange-alt', 
      link: '/admin/transactions', 
      color: 'info',
      description: 'Monitor all system transactions'
    },
    { 
      title: 'System Reports', 
      icon: 'fas fa-chart-bar', 
      link: '/admin/reports', 
      color: 'warning',
      description: 'Generate comprehensive reports'
    },
    { 
      title: 'System Settings', 
      icon: 'fas fa-cogs', 
      link: '/admin/settings', 
      color: 'danger',
      description: 'Configure system parameters'
    },
    { 
      title: 'Security Center', 
      icon: 'fas fa-shield-alt', 
      link: '/admin/security', 
      color: 'dark',
      description: 'Monitor security and access logs'
    }
  ];

  systemStats: SystemStat[] = [];
  recentActivities: RecentActivity[] = [];
  adminName = 'Administrator';
  isLoading = true;
  
  // Summary data
  totalUsers = 0;
  totalAccounts = 0;
  totalTransactions = 0;
  systemHealth = 'Excellent';
  
  constructor(
    private mockDataService: MockDataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAdminData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAdminData(): void {
    // Load admin name
    this.adminName = this.authService.getCurrentUserDisplayName() || 'Administrator';

    // Load comprehensive system statistics
    combineLatest([
      this.mockDataService.getUsers(),
      this.mockDataService.getAccounts(),
      this.mockDataService.getTransactions(),
      this.mockDataService.getUserStatistics()
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ([users, accounts, transactions, userStats]) => {
        this.updateSystemStats(users, accounts, transactions, userStats);
        this.generateRecentActivities(users, transactions);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading admin data:', error);
        this.loadFallbackData();
        this.isLoading = false;
      }
    });
  }

  private updateSystemStats(users: MockUser[], accounts: MockAccount[], transactions: MockTransaction[], userStats: any): void {
    this.totalUsers = users.length;
    this.totalAccounts = accounts.length;
    this.totalTransactions = transactions.length;
    
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const avgBalance = accounts.length > 0 ? totalBalance / accounts.length : 0;
    const monthlyTransactions = transactions.filter(t => {
      const txDate = new Date(t.date);
      const now = new Date();
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    }).length;
    
    this.systemStats = [
      { 
        label: 'Total Users', 
        value: users.length.toString(), 
        icon: 'fas fa-users', 
        color: 'primary',
        trend: 'up',
        change: '+12%'
      },
      { 
        label: 'Active Accounts', 
        value: accounts.filter(a => a.status === 'Active').length.toString(), 
        icon: 'fas fa-university', 
        color: 'success',
        trend: 'up',
        change: '+8%'
      },
      { 
        label: 'Total Balance', 
        value: this.mockDataService.formatCurrency(totalBalance).replace('EGP', '').trim(), 
        icon: 'fas fa-wallet', 
        color: 'info',
        trend: 'up',
        change: '+15%'
      },
      { 
        label: 'Monthly Transactions', 
        value: monthlyTransactions.toString(), 
        icon: 'fas fa-exchange-alt', 
        color: 'warning',
        trend: 'up',
        change: '+22%'
      },
      { 
        label: 'Active Sessions', 
        value: userStats.active.toString(), 
        icon: 'fas fa-signal', 
        color: 'success',
        trend: 'stable',
        change: '0%'
      },
      { 
        label: 'System Health', 
        value: '98.5%', 
        icon: 'fas fa-heartbeat', 
        color: 'success',
        trend: 'up',
        change: '+0.2%'
      }
    ];
  }

  private generateRecentActivities(users: MockUser[], transactions: MockTransaction[]): void {
    const activities: RecentActivity[] = [];
    
    // Add recent user activities
    const recentUsers = users.slice(0, 2);
    recentUsers.forEach(user => {
      activities.push({
        type: 'user',
        title: `New User Registration`,
        description: `${user.firstName} ${user.lastName} joined the system`,
        time: new Date(user.createdAt),
        icon: 'fas fa-user-plus',
        color: 'primary'
      });
    });
    
    // Add recent transactions
    const recentTxns = transactions.slice(0, 3);
    recentTxns.forEach(txn => {
      activities.push({
        type: 'transaction',
        title: `${txn.type} Transaction`,
        description: `${txn.description} - ${this.mockDataService.formatCurrency(txn.amount)}`,
        time: new Date(txn.date),
        icon: txn.type === 'Credit' ? 'fas fa-arrow-down' : 'fas fa-arrow-up',
        color: txn.type === 'Credit' ? 'success' : 'warning'
      });
    });
    
    // Add system activities
    activities.push({
      type: 'system',
      title: 'System Backup Completed',
      description: 'Daily backup completed successfully',
      time: new Date(),
      icon: 'fas fa-database',
      color: 'info'
    });
    
    // Sort by time and take most recent
    this.recentActivities = activities
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, 6);
  }

  private loadFallbackData(): void {
    this.systemStats = [
      { label: 'Total Users', value: '156', icon: 'fas fa-users', color: 'primary', trend: 'up', change: '+12%' },
      { label: 'Active Accounts', value: '243', icon: 'fas fa-university', color: 'success', trend: 'up', change: '+8%' },
      { label: 'Total Balance', value: '2.4M', icon: 'fas fa-wallet', color: 'info', trend: 'up', change: '+15%' },
      { label: 'Monthly Transactions', value: '1,847', icon: 'fas fa-exchange-alt', color: 'warning', trend: 'up', change: '+22%' },
      { label: 'Active Sessions', value: '42', icon: 'fas fa-signal', color: 'success', trend: 'stable', change: '0%' },
      { label: 'System Health', value: '98.5%', icon: 'fas fa-heartbeat', color: 'success', trend: 'up', change: '+0.2%' }
    ];

    this.recentActivities = [
      {
        type: 'user',
        title: 'New User Registration',
        description: 'Ahmed Hassan joined the system',
        time: new Date(Date.now() - 1000 * 60 * 30),
        icon: 'fas fa-user-plus',
        color: 'primary'
      },
      {
        type: 'transaction',
        title: 'Large Transaction Alert',
        description: 'Transfer of EGP 50,000 processed',
        time: new Date(Date.now() - 1000 * 60 * 45),
        icon: 'fas fa-exclamation-triangle',
        color: 'warning'
      },
      {
        type: 'system',
        title: 'System Backup Completed',
        description: 'Daily backup completed successfully',
        time: new Date(Date.now() - 1000 * 60 * 60),
        icon: 'fas fa-database',
        color: 'info'
      }
    ];
    
    this.totalUsers = 156;
    this.totalAccounts = 243;
    this.totalTransactions = 1847;
  }

  getActivityIcon(activity: RecentActivity): string {
    return activity.icon;
  }

  getActivityColor(activity: RecentActivity): string {
    switch (activity.color) {
      case 'primary': return 'text-primary';
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'info': return 'text-info';
      case 'danger': return 'text-danger';
      default: return 'text-muted';
    }
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up': return 'fas fa-arrow-up text-success';
      case 'down': return 'fas fa-arrow-down text-danger';
      case 'stable': return 'fas fa-minus text-muted';
      default: return 'fas fa-circle text-muted';
    }
  }

  getTrendClass(trend: string): string {
    switch (trend) {
      case 'up': return 'trend-up';
      case 'down': return 'trend-down';
      case 'stable': return 'trend-stable';
      default: return 'trend-neutral';
    }
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  }
}
