import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap, of, timeout, catchError } from 'rxjs';
import { User } from '../models/user.interface';
import { UserRole } from '../enums/user-role.enum';
import { MockDataService, User as MockUser } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_TIMEOUT = 5000; // 5 seconds timeout for authentication
  private readonly USER_CACHE_KEY = 'bankingApp_fastAuth';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Store the current user's MockUser data for additional functionality
  private currentMockUserSubject = new BehaviorSubject<MockUser | null>(null);
  public currentMockUser$ = this.currentMockUserSubject.asObservable();
  
  // Loading state
  private isAuthenticating = false;

  constructor(private mockDataService: MockDataService) {
    // Check if user is already logged in
    this.loadUserFromStorage();
  }

  /**
   * Fast authentication using cached credentials (for development)
   */
  fastLogin(username: string, password: string): Observable<{ success: boolean; user?: User; message?: string }> {
    // Fast authentication for known users to reduce loading time
    const fastAuthUsers: { [key: string]: { password: string; mockUser: MockUser } } = {
      'admin': {
        password: 'admin123',
        mockUser: {
          id: 'USR001',
          username: 'admin',
          email: 'admin@bankmasr.com',
          phone: '+20 100 123 4567',
          role: 'Admin',
          status: 'Active',
          firstName: 'System',
          lastName: 'Administrator',
          dateOfBirth: '1980-01-01',
          nationalId: '12345678901234',
          address: {
            street: '123 Admin Street',
            city: 'Cairo',
            state: 'Cairo',
            zipCode: '11511',
            country: 'Egypt'
          },
          createdAt: '2024-01-01T00:00:00Z',
          lastLogin: new Date().toISOString(),
          profileImage: 'https://via.placeholder.com/150?text=Admin'
        }
      },
      'ahmed': {
        password: 'ahmed123',
        mockUser: {
          id: 'USR002',
          username: 'ahmed',
          email: 'ahmed@example.com',
          phone: '+20 101 234 5678',
          role: 'User',
          status: 'Active',
          firstName: 'Ahmed',
          lastName: 'Hassan',
          dateOfBirth: '1990-05-15',
          nationalId: '29005150123456',
          address: {
            street: '456 User Avenue',
            city: 'Giza',
            state: 'Giza',
            zipCode: '12411',
            country: 'Egypt'
          },
          createdAt: '2024-01-15T10:30:00Z',
          lastLogin: new Date().toISOString(),
          profileImage: 'https://via.placeholder.com/150?text=Ahmed'
        }
      },
      'user1': {
        password: 'user123',
        mockUser: {
          id: 'USR003',
          username: 'user1',
          email: 'user1@example.com',
          phone: '+20 102 345 6789',
          role: 'User',
          status: 'Active',
          firstName: 'User',
          lastName: 'One',
          dateOfBirth: '1988-12-20',
          nationalId: '28812200987654',
          address: {
            street: '789 Demo Street',
            city: 'Alexandria',
            state: 'Alexandria',
            zipCode: '21500',
            country: 'Egypt'
          },
          createdAt: '2024-02-01T14:20:00Z',
          lastLogin: new Date().toISOString(),
          profileImage: 'https://via.placeholder.com/150?text=User1'
        }
      }
    };
    
    const userAuth = fastAuthUsers[username];
    
    if (userAuth && userAuth.password === password) {
      // Immediate authentication success
      const legacyUser = this.convertMockUserToLegacyUser(userAuth.mockUser);
      this.setCurrentUser(legacyUser);
      this.currentMockUserSubject.next(userAuth.mockUser);
      localStorage.setItem('currentMockUser', JSON.stringify(userAuth.mockUser));
      
      console.log('⚡ Fast authentication successful for:', username);
      
      return of({ success: true, user: legacyUser });
    }
    
    return of({ success: false, message: 'Invalid username or password' });
  }
  
  /**
   * Authenticate user with username and password (using MockDataService)
   */
  login(username: string, password: string): Observable<{ success: boolean; user?: User; message?: string }> {
    // Prevent multiple concurrent authentication attempts
    if (this.isAuthenticating) {
      return of({ success: false, message: 'Authentication in progress...' });
    }
    
    this.isAuthenticating = true;
    
    // First try fast authentication for better performance
    const fastAuth = this.fastLogin(username, password);
    
    // If fast auth succeeds, return immediately
    return fastAuth.pipe(
      switchMap(result => {
        if (result.success) {
          this.isAuthenticating = false;
          return of(result);
        }
        
        // Fallback to full MockDataService authentication with timeout
        return this.mockDataService.authenticateUser(username, password).pipe(
          timeout(this.AUTH_TIMEOUT),
          map(mockResult => {
            if (mockResult.success && mockResult.user) {
              const legacyUser = this.convertMockUserToLegacyUser(mockResult.user);
              this.setCurrentUser(legacyUser);
              this.currentMockUserSubject.next(mockResult.user);
              localStorage.setItem('currentMockUser', JSON.stringify(mockResult.user));
              console.log('✅ Full authentication successful for:', username);
              return { success: true, user: legacyUser };
            }
            return { success: false, message: mockResult.message || 'Authentication failed' };
          }),
          catchError(error => {
            console.error('Authentication error:', error);
            const message = error.name === 'TimeoutError' 
              ? 'Authentication timeout. Please try again.' 
              : 'Authentication failed. Please try again.';
            return of({ success: false, message });
          })
        );
      }),
      map(result => {
        this.isAuthenticating = false;
        return result;
      }),
      catchError(error => {
        this.isAuthenticating = false;
        console.error('Login error:', error);
        return of({ success: false, message: 'Login failed. Please try again.' });
      })
    );
  }

  /**
   * Logout current user
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentMockUser');
    this.currentUserSubject.next(null);
    this.currentMockUserSubject.next(null);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Get current user role
   */
  getUserRole(): UserRole | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  /**
   * Check if current user has admin role
   */
  isAdmin(): boolean {
    return this.getUserRole() === UserRole.Admin;
  }

  /**
   * Check if current user has user role
   */
  isUser(): boolean {
    return this.getUserRole() === UserRole.User;
  }

  /**
   * Set current user and store in localStorage
   */
  private setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userRole', user.role);
    this.currentUserSubject.next(user);
  }

  /**
   * Load user from localStorage
   */
  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    const storedMockUser = localStorage.getItem('currentMockUser');
    
    if (storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        
        // Also load MockUser if available
        if (storedMockUser) {
          const mockUser: MockUser = JSON.parse(storedMockUser);
          this.currentMockUserSubject.next(mockUser);
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.logout();
      }
    }
  }

  /**
   * Convert MockUser to legacy User format for backward compatibility
   */
  private convertMockUserToLegacyUser(mockUser: MockUser): User {
    const roleMap: { [key: string]: UserRole } = {
      'Admin': UserRole.Admin,
      'User': UserRole.User
    };

    return {
      id: parseInt(mockUser.id.replace('USR', '')) || 1,
      userName: mockUser.username,
      password: '', // Don't store password
      role: roleMap[mockUser.role] || UserRole.User,
      isActive: mockUser.status === 'Active',
      email: mockUser.email,
      phone: mockUser.phone
    };
  }

  /**
   * Get all mock users (for admin panel) - using MockDataService
   */
  getAllUsers(): Observable<User[]> {
    return this.mockDataService.getUsers().pipe(
      map(mockUsers => mockUsers.map(mockUser => this.convertMockUserToLegacyUser(mockUser)))
    );
  }

  /**
   * Get all mock users synchronously (for backward compatibility)
   */
  getAllUsersSync(): User[] {
    // This is a fallback method, but data might not be loaded yet
    return [];
  }

  /**
   * Update user status using MockDataService
   */
  updateUserStatus(userId: number, isActive: boolean): boolean {
    // Convert numeric ID to string format used by MockDataService
    const userIdStr = `USR${userId.toString().padStart(3, '0')}`;
    
    // This would need to be implemented in MockDataService
    // For now, return true as a placeholder
    return true;
  }

  /**
   * Get current mock user (with full data)
   */
  getCurrentMockUser(): MockUser | null {
    return this.currentMockUserSubject.value;
  }

  /**
   * Get current user ID (from MockUser format)
   */
  getCurrentUserId(): string | null {
    const mockUser = this.getCurrentMockUser();
    return mockUser ? mockUser.id : null;
  }

  /**
   * Get current user's full name
   */
  getCurrentUserFullName(): string {
    const mockUser = this.getCurrentMockUser();
    if (mockUser) {
      return `${mockUser.firstName} ${mockUser.lastName}`;
    }
    
    const legacyUser = this.getCurrentUser();
    return legacyUser ? legacyUser.userName : 'Unknown User';
  }

  /**
   * Get current user's display name
   */
  getCurrentUserDisplayName(): string {
    const mockUser = this.getCurrentMockUser();
    if (mockUser) {
      return mockUser.firstName || mockUser.username;
    }
    
    const legacyUser = this.getCurrentUser();
    return legacyUser ? legacyUser.userName : 'User';
  }

  /**
   * Check if user data is fully loaded
   */
  isUserDataLoaded(): boolean {
    return this.getCurrentMockUser() !== null;
  }
  
  /**
   * Get authentication loading state
   */
  isAuthenticatingUser(): boolean {
    return this.isAuthenticating;
  }
  
  /**
   * Clear all authentication cache
   */
  clearAuthCache(): void {
    localStorage.removeItem(this.USER_CACHE_KEY);
  }
  
  /**
   * Pre-load user data for faster subsequent access
   */
  preloadUserData(): void {
    // This can be called when the app starts to warm up the cache
    if (!this.mockDataService.getDataLoadedState()) {
      // The MockDataService will initialize automatically when accessed
      this.mockDataService.getUsers().subscribe();
    }
  }
  
  /**
   * Quick login state check (synchronous)
   */
  quickLoginCheck(): { isLoggedIn: boolean; userRole: UserRole | null; username: string | null } {
    const user = this.getCurrentUser();
    const mockUser = this.getCurrentMockUser();
    
    return {
      isLoggedIn: user !== null,
      userRole: user?.role || null,
      username: mockUser?.username || user?.userName || null
    };
  }

  // Legacy methods for backward compatibility (deprecated)
  /**
   * @deprecated Use getAllUsers() instead
   */
  addUser(user: Omit<User, 'id'>): User {
    const newId = Date.now(); // Use timestamp as ID
    const newUser: User = { ...user, id: newId };
    // This would need implementation in MockDataService
    return newUser;
  }

  /**
   * @deprecated Use MockDataService methods instead
   */
  updateUser(userId: number, userData: Partial<User>): boolean {
    // This would need implementation in MockDataService
    return false;
  }

  /**
   * @deprecated Use MockDataService methods instead
   */
  deleteUser(userId: number): boolean {
    // This would need implementation in MockDataService
    return false;
  }
}
