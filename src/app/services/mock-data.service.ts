import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap } from 'rxjs';

// Mock data interfaces
export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: 'Admin' | 'User';
  status: 'Active' | 'Inactive';
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationalId: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  lastLogin: string;
  profileImage: string;
}

export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  accountType: string;
  accountName: string;
  balance: number;
  currency: string;
  status: string;
  openingDate: string;
  interestRate: number;
  minimumBalance: number;
  branch: {
    code: string;
    name: string;
    address: string;
  };
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  accountId: string;
  userId: string;
  type: 'Credit' | 'Debit';
  amount: number;
  currency: string;
  description: string;
  category: string;
  status: string;
  date: string;
  transactionReference: string;
  fromAccount: string | null;
  toAccount: string | null;
  balance: number;
  fees: number;
  channel: string;
}

export interface Branch {
  code: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  email: string;
  manager: string;
  services: string[];
  workingHours: { [key: string]: string };
  atmCount: number;
  isHeadquarters: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private readonly MOCK_DATA_PATH = 'assets/mock-data';
  private readonly STORAGE_KEYS = {
    USERS: 'bankingApp_users',
    ACCOUNTS: 'bankingApp_accounts',
    TRANSACTIONS: 'bankingApp_transactions',
    BRANCHES: 'bankingApp_branches',
    DATA_VERSION: 'bankingApp_dataVersion',
    LAST_UPDATED: 'bankingApp_lastUpdated'
  };
  
  private readonly DATA_VERSION = '1.0.0'; // Increment when data structure changes
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  // Data caches
  private usersCache$ = new BehaviorSubject<User[]>([]);
  private accountsCache$ = new BehaviorSubject<Account[]>([]);
  private transactionsCache$ = new BehaviorSubject<Transaction[]>([]);
  private branchesCache$ = new BehaviorSubject<Branch[]>([]);
  
  // Loading states
  private isDataLoaded = false;
  private isLoading = false;
  private loadingPromise: Promise<void> | null = null;

  constructor(private http: HttpClient) {
    this.initializeData();
  }

  /**
   * Initialize data with optimized caching strategy
   */
  private async initializeData(): Promise<void> {
    if (this.isDataLoaded || this.isLoading) return;
    
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.isLoading = true;
    this.loadingPromise = this.loadDataWithCaching();
    
    try {
      await this.loadingPromise;
      this.isDataLoaded = true;
    } catch (error) {
      console.error('Failed to initialize data:', error);
    } finally {
      this.isLoading = false;
      this.loadingPromise = null;
    }
  }

  /**
   * Load data with local storage caching
   */
  private async loadDataWithCaching(): Promise<void> {
    // Check if cached data is valid and fresh
    if (this.isCacheValid()) {
      this.loadFromCache();
      // Load fresh data in background if cache is getting old
      if (this.shouldRefreshCache()) {
        setTimeout(() => this.loadFreshDataInBackground(), 1000);
      }
      return;
    }

    // Load fresh data and cache it
    await this.loadFreshData();
  }

  /**
   * Check if cached data is valid
   */
  private isCacheValid(): boolean {
    const dataVersion = localStorage.getItem(this.STORAGE_KEYS.DATA_VERSION);
    const lastUpdated = localStorage.getItem(this.STORAGE_KEYS.LAST_UPDATED);
    const cachedUsers = localStorage.getItem(this.STORAGE_KEYS.USERS);
    
    if (!dataVersion || !lastUpdated || !cachedUsers) {
      return false;
    }
    
    if (dataVersion !== this.DATA_VERSION) {
      this.clearCache();
      return false;
    }
    
    const cacheAge = Date.now() - parseInt(lastUpdated, 10);
    return cacheAge < this.CACHE_DURATION;
  }

  /**
   * Check if cache should be refreshed (>50% of cache duration)
   */
  private shouldRefreshCache(): boolean {
    const lastUpdated = localStorage.getItem(this.STORAGE_KEYS.LAST_UPDATED);
    if (!lastUpdated) return true;
    
    const cacheAge = Date.now() - parseInt(lastUpdated, 10);
    return cacheAge > (this.CACHE_DURATION * 0.5);
  }

  /**
   * Load data from local storage cache
   */
  private loadFromCache(): void {
    try {
      const cachedUsers = localStorage.getItem(this.STORAGE_KEYS.USERS);
      const cachedAccounts = localStorage.getItem(this.STORAGE_KEYS.ACCOUNTS);
      const cachedTransactions = localStorage.getItem(this.STORAGE_KEYS.TRANSACTIONS);
      const cachedBranches = localStorage.getItem(this.STORAGE_KEYS.BRANCHES);
      
      if (cachedUsers) {
        this.usersCache$.next(JSON.parse(cachedUsers));
      }
      if (cachedAccounts) {
        this.accountsCache$.next(JSON.parse(cachedAccounts));
      }
      if (cachedTransactions) {
        this.transactionsCache$.next(JSON.parse(cachedTransactions));
      }
      if (cachedBranches) {
        this.branchesCache$.next(JSON.parse(cachedBranches));
      }
      
      console.log('✅ Data loaded from cache successfully');
    } catch (error) {
      console.error('Failed to load from cache:', error);
      this.clearCache();
    }
  }

  /**
   * Load fresh data from JSON files
   */
  private async loadFreshData(): Promise<void> {
    try {
      console.log('🔄 Loading fresh data...');
      
      // Load all data concurrently for better performance
      const [usersResponse, accountsResponse, transactionsResponse, branchesResponse] = await Promise.all([
        this.http.get<{users: User[]}>(`${this.MOCK_DATA_PATH}/users.json`).toPromise(),
        this.http.get<{accounts: Account[]}>(`${this.MOCK_DATA_PATH}/accounts.json`).toPromise(),
        this.http.get<{transactions: Transaction[]}>(`${this.MOCK_DATA_PATH}/transactions.json`).toPromise(),
        this.http.get<{branches: Branch[]}>(`${this.MOCK_DATA_PATH}/branches.json`).toPromise()
      ]);
      
      // Update caches
      if (usersResponse) {
        this.usersCache$.next(usersResponse.users);
        localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(usersResponse.users));
      }
      
      if (accountsResponse) {
        this.accountsCache$.next(accountsResponse.accounts);
        localStorage.setItem(this.STORAGE_KEYS.ACCOUNTS, JSON.stringify(accountsResponse.accounts));
      }
      
      if (transactionsResponse) {
        this.transactionsCache$.next(transactionsResponse.transactions);
        localStorage.setItem(this.STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactionsResponse.transactions));
      }
      
      if (branchesResponse) {
        this.branchesCache$.next(branchesResponse.branches);
        localStorage.setItem(this.STORAGE_KEYS.BRANCHES, JSON.stringify(branchesResponse.branches));
      }
      
      // Update cache metadata
      localStorage.setItem(this.STORAGE_KEYS.DATA_VERSION, this.DATA_VERSION);
      localStorage.setItem(this.STORAGE_KEYS.LAST_UPDATED, Date.now().toString());
      
      console.log('✅ Fresh data loaded and cached successfully');
    } catch (error) {
      console.error('Failed to load fresh data:', error);
      // Try to fall back to cache if available
      if (localStorage.getItem(this.STORAGE_KEYS.USERS)) {
        console.log('📦 Falling back to cached data');
        this.loadFromCache();
      }
      throw error;
    }
  }

  /**
   * Load fresh data in background without blocking UI
   */
  private loadFreshDataInBackground(): void {
    this.loadFreshData().catch(error => {
      console.log('Background data refresh failed:', error);
    });
  }

  /**
   * Clear all cached data
   */
  private clearCache(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  /**
   * Force refresh all data (clear cache and reload)
   */
  async refreshData(): Promise<void> {
    this.clearCache();
    this.isDataLoaded = false;
    await this.initializeData();
  }

  /**
   * Get loading state
   */
  isDataLoading(): boolean {
    return this.isLoading;
  }

  /**
   * Get data loaded state
   */
  getDataLoadedState(): boolean {
    return this.isDataLoaded;
  }

  // User methods
  getUsers(): Observable<User[]> {
    return this.usersCache$.asObservable();
  }

  getUserById(id: string): Observable<User | undefined> {
    return this.usersCache$.pipe(
      map(users => users.find(user => user.id === id))
    );
  }

  getUserByUsername(username: string): Observable<User | undefined> {
    return this.usersCache$.pipe(
      map(users => users.find(user => user.username === username))
    );
  }

  updateUser(updatedUser: User): void {
    const currentUsers = this.usersCache$.value;
    const index = currentUsers.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      currentUsers[index] = updatedUser;
      this.usersCache$.next([...currentUsers]);
    }
  }

  deleteUser(userId: string): void {
    const currentUsers = this.usersCache$.value;
    const filteredUsers = currentUsers.filter(user => user.id !== userId);
    this.usersCache$.next(filteredUsers);
  }

  // Account methods
  getAccounts(): Observable<Account[]> {
    return this.accountsCache$.asObservable();
  }

  getAccountsByUserId(userId: string): Observable<Account[]> {
    return this.accountsCache$.pipe(
      map(accounts => accounts.filter(account => account.userId === userId))
    );
  }

  getAccountById(accountId: string): Observable<Account | undefined> {
    return this.accountsCache$.pipe(
      map(accounts => accounts.find(account => account.id === accountId))
    );
  }

  updateAccountBalance(accountId: string, newBalance: number): void {
    const currentAccounts = this.accountsCache$.value;
    const index = currentAccounts.findIndex(account => account.id === accountId);
    if (index !== -1) {
      currentAccounts[index].balance = newBalance;
      this.accountsCache$.next([...currentAccounts]);
    }
  }

  // Transaction methods
  getTransactions(): Observable<Transaction[]> {
    return this.transactionsCache$.asObservable();
  }

  getTransactionsByUserId(userId: string): Observable<Transaction[]> {
    return this.transactionsCache$.pipe(
      map(transactions => 
        transactions
          .filter(transaction => transaction.userId === userId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      )
    );
  }

  getTransactionsByAccountId(accountId: string): Observable<Transaction[]> {
    return this.transactionsCache$.pipe(
      map(transactions => 
        transactions
          .filter(transaction => transaction.accountId === accountId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      )
    );
  }

  addTransaction(transaction: Transaction): void {
    const currentTransactions = this.transactionsCache$.value;
    this.transactionsCache$.next([transaction, ...currentTransactions]);
  }

  // Branch methods
  getBranches(): Observable<Branch[]> {
    return this.branchesCache$.asObservable();
  }

  getBranchByCode(code: string): Observable<Branch | undefined> {
    return this.branchesCache$.pipe(
      map(branches => branches.find(branch => branch.code === code))
    );
  }

  // Statistics methods
  getUserStatistics(): Observable<{
    total: number;
    active: number;
    inactive: number;
    admins: number;
  }> {
    return this.usersCache$.pipe(
      map(users => ({
        total: users.length,
        active: users.filter(u => u.status === 'Active').length,
        inactive: users.filter(u => u.status === 'Inactive').length,
        admins: users.filter(u => u.role === 'Admin').length
      }))
    );
  }

  getAccountStatistics(userId: string): Observable<{
    totalBalance: number;
    accountCount: number;
    averageBalance: number;
  }> {
    return this.getAccountsByUserId(userId).pipe(
      map(accounts => {
        const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
        return {
          totalBalance,
          accountCount: accounts.length,
          averageBalance: accounts.length > 0 ? totalBalance / accounts.length : 0
        };
      })
    );
  }

  getTransactionStatistics(userId: string): Observable<{
    totalTransactions: number;
    totalCredits: number;
    totalDebits: number;
    monthlyTransactions: number;
  }> {
    return this.getTransactionsByUserId(userId).pipe(
      map(transactions => {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyTxns = transactions.filter(t => new Date(t.date) >= monthStart);
        
        return {
          totalTransactions: transactions.length,
          totalCredits: transactions.filter(t => t.type === 'Credit').length,
          totalDebits: transactions.filter(t => t.type === 'Debit').length,
          monthlyTransactions: monthlyTxns.length
        };
      })
    );
  }

  // Search and filter methods
  searchTransactions(userId: string, query: string): Observable<Transaction[]> {
    return this.getTransactionsByUserId(userId).pipe(
      map(transactions => 
        transactions.filter(transaction => 
          transaction.description.toLowerCase().includes(query.toLowerCase()) ||
          transaction.category.toLowerCase().includes(query.toLowerCase()) ||
          transaction.transactionReference.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  filterTransactionsByType(userId: string, type: 'Credit' | 'Debit' | 'All'): Observable<Transaction[]> {
    return this.getTransactionsByUserId(userId).pipe(
      map(transactions => 
        type === 'All' 
          ? transactions 
          : transactions.filter(transaction => transaction.type === type)
      )
    );
  }

  filterTransactionsByDateRange(userId: string, startDate: Date, endDate: Date): Observable<Transaction[]> {
    return this.getTransactionsByUserId(userId).pipe(
      map(transactions => 
        transactions.filter(transaction => {
          const txnDate = new Date(transaction.date);
          return txnDate >= startDate && txnDate <= endDate;
        })
      )
    );
  }

  // Authentication helpers
  authenticateUser(username: string, password: string): Observable<{ success: boolean; user?: User; message?: string }> {
    return this.getUserByUsername(username).pipe(
      map(user => {
        if (!user) {
          return { success: false, message: 'User not found' };
        }

        // Simple password check (in real app, this would be hashed)
        const validPasswords: { [key: string]: string } = {
          'admin': 'admin123',
          'user1': 'user123',
          'user2': 'user123',
          'user3': 'user123',
          'ahmed': 'ahmed123',
          'sara.mahmoud': 'sara123'
        };

        if (validPasswords[username] === password) {
          // Update last login
          const updatedUser = { ...user, lastLogin: new Date().toISOString() };
          this.updateUser(updatedUser);
          return { success: true, user: updatedUser };
        }

        return { success: false, message: 'Invalid password' };
      })
    );
  }

  // Utility methods
  generateTransactionId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `TXN${timestamp}${random}`;
  }

  generateAccountNumber(userId: string): string {
    const userNum = userId.replace('USR', '');
    const timestamp = Date.now().toString().slice(-6);
    return `BM-2025${userNum}-${timestamp}`;
  }

  formatCurrency(amount: number, currency: string = 'EGP'): string {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatDateTime(date: string | Date): string {
    return new Date(date).toLocaleString('en-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
