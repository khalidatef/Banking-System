import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserNavComponent } from '../../components/user-nav/user-nav.component';
import { AuthService, AccountService, TransactionService } from '../../services';
import { User } from '../../data/mock-users';
import { Account } from '../../models';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, UserNavComponent, RouterOutlet],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css'
})
export class UserLayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  sidebarOpen = false;
  isLoading = false;
  currentUser: User | null = null;
  userAccount: Account | null = null;

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.subscribeToUserData();
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Subscribe to user data changes
   */
  private subscribeToUserData(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.loadUserAccount();
        }
      });
  }

  /**
   * Load initial user data
   */
  private loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadUserAccount();
    }
  }

  /**
   * Load user account data
   */
  private loadUserAccount(): void {
    if (!this.currentUser) return;

    this.isLoading = true;
    this.accountService.getAccountByUserId(parseInt(this.currentUser.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (accounts) => {
          if (accounts && accounts.length > 0) {
            this.userAccount = accounts[0];
            this.accountService.setUserAccount(this.userAccount);
            this.loadUserTransactions();
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading user account:', error);
          this.isLoading = false;
        }
      });
  }

  /**
   * Load user transactions
   */
  private loadUserTransactions(): void {
    if (!this.userAccount) return;

    this.transactionService.getUserRecentTransactions(this.userAccount.accountNo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transactions) => {
          // Transactions are automatically set in the service
        },
        error: (error) => {
          console.error('Error loading user transactions:', error);
        }
      });
  }

  /**
   * Toggle sidebar (for future mobile menu implementation)
   */
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this.isLoading = loading;
  }
}
