import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { users, Role, User } from '../data/mock-users';

const ROLE_KEY = 'role';
const USERNAME_KEY = 'username';

type AuthLastError = 'INACTIVE' | 'INVALID' | null;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private roleCache: Role | null = null;
  private usernameCache: string | null = null;
  
  // Enhanced features preserved from your version
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  public lastError: AuthLastError = null;

  constructor() {
    // Load user from storage on initialization
    this.loadUserFromStorage();
  }

  // Simple and clean login method
  login(username: string, password: string): Role | null {
    const uName = (username ?? '').trim();
    const pWord = (password ?? '').trim();

    // Reset error state
    this.lastError = null;
    
    // Basic validation
    if (!uName || !pWord) {
      this.lastError = 'INVALID';
      return null;
    }
    
    // Find user by username first
    const userByName = users.find(x => x.username === uName);
    
    // Check if user exists but is inactive
    if (userByName && !userByName.isActive) {
      this.lastError = 'INACTIVE';
      return null;
    }

    // Find active user with matching credentials
    const user = users.find(
      x => x.username === uName && x.password === pWord && x.isActive
    );
    
    if (!user) {
      this.lastError = 'INVALID';
      return null;
    }

    // Success - store user data
    this.roleCache = user.role;
    this.usernameCache = user.username;
    this.currentUserSubject.next(user);

    if (this.isBrowser) {
      localStorage.setItem(ROLE_KEY, user.role);
      localStorage.setItem(USERNAME_KEY, user.username);
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    return user.role;
  }

  logout(): void {
    this.roleCache = null;
    this.usernameCache = null;
    this.currentUserSubject.next(null);
    
    if (this.isBrowser) {
      localStorage.removeItem(ROLE_KEY);
      localStorage.removeItem(USERNAME_KEY);
      // Enhanced: Remove additional stored data
      localStorage.removeItem('currentUser');
    }
  }

  getRole(): Role | null {
    if (this.isBrowser) {
      const v = localStorage.getItem(ROLE_KEY);
      return v === 'Admin' || v === 'User' ? (v as Role) : null;
    }
    return this.roleCache;
  }

  getUsername(): string | null {
    if (this.isBrowser) return localStorage.getItem(USERNAME_KEY);
    return this.usernameCache;
  }

  isLoggedIn(): boolean {
    return this.getRole() !== null;
  }

  // Enhanced: Async version for backward compatibility
  loginAsync(username: string, password: string): Observable<{ success: boolean; user?: User; message?: string }> {
    const role = this.login(username, password);
    const user = users.find(u => u.username === username && u.password === password && u.isActive);
    
    if (role && user) {
      return of({ success: true, user });
    }
    
    const message = this.lastError === 'INACTIVE' ? 'User account is inactive' : 'Invalid username or password';
    return of({ success: false, message });
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get current user role (using Role enum)
   */
  getUserRole(): Role | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  /**
   * Check if current user has admin role
   */
  isAdmin(): boolean {
    return this.getRole() === Role.Admin;
  }

  /**
   * Check if current user has user role
   */
  isUser(): boolean {
    return this.getRole() === Role.User;
  }

  /**
   * Load user from localStorage
   */
  private loadUserFromStorage(): void {
    if (this.isBrowser) {
      const storedUser = localStorage.getItem('currentUser');
      const storedRole = localStorage.getItem(ROLE_KEY);
      const storedUsername = localStorage.getItem(USERNAME_KEY);
      
      console.log('🔍 Loading from localStorage:', { 
        hasStoredUser: !!storedUser, 
        storedRole, 
        storedUsername 
      });
      
      if (storedUser && storedRole && storedUsername) {
        try {
          const user: User = JSON.parse(storedUser);
          
          // Validate user data integrity
          if (!user.username || !user.role || user.username !== storedUsername || user.role !== storedRole) {
            console.warn('⚠️ localStorage data inconsistency detected, clearing...');
            this.logout();
            return;
          }
          
          // Verify user still exists and is active in the system
          const currentUser = users.find(u => u.username === user.username && u.isActive);
          if (!currentUser) {
            console.warn('⚠️ Stored user no longer exists or is inactive, clearing...');
            this.logout();
            return;
          }
          
          this.currentUserSubject.next(user);
          this.roleCache = storedRole as Role;
          this.usernameCache = storedUsername;
          console.log('✅ Successfully loaded user from storage:', user.username);
        } catch (error) {
          console.error('❌ Error parsing stored user:', error);
          this.logout();
        }
      } else {
        console.log('ℹ️ No complete user data in localStorage');
      }
    }
  }

  /**
   * Get all users (for admin functionality)
   */
  getAllUsers(): User[] {
    return users;
  }

  /**
   * Get current user's display name
   */
  getCurrentUserDisplayName(): string {
    const user = this.getCurrentUser();
    return user ? user.username : 'User';
  }

  /**
   * Get current user's full name (fallback to username)
   */
  getCurrentUserFullName(): string {
    const user = this.getCurrentUser();
    return user ? user.username : 'Unknown User';
  }

  /**
   * Update user status
   */
  updateUserStatus(userId: string, isActive: boolean): boolean {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].isActive = isActive;
      return true;
    }
    return false;
  }
}
