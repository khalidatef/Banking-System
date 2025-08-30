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
  
  // Enhanced features for compatibility with existing components
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  public lastError: AuthLastError = null;

  constructor() {
    // Load user from storage on initialization
    this.loadUserFromStorage();
  }

  // Team's proven working login method
  login(username: string, password: string): Role | null {
    const uName = (username ?? '').trim();
    const pWord = (password ?? '').trim();

    // Reset error state first
    this.lastError = null;

    const recByName = users.find(x => x.username === uName);
    if (recByName && !recByName.isActive) {
      this.lastError = 'INACTIVE';
      return null;
    }

    const u = users.find(
      x => x.username === uName && x.password === pWord && x.isActive
    );
    if (!u) {
      this.lastError = 'INVALID';
      return null;
    }

    // Success - store user data
    this.roleCache = u.role;
    this.usernameCache = u.username;
    this.currentUserSubject.next(u);

    if (this.isBrowser) {
      localStorage.setItem(ROLE_KEY, u.role);
      localStorage.setItem(USERNAME_KEY, u.username);
      localStorage.setItem('currentUser', JSON.stringify(u));
    }
    return u.role;
  }

  logout(): void {
    this.roleCache = null;
    this.usernameCache = null;
    this.currentUserSubject.next(null);
    
    if (this.isBrowser) {
      localStorage.removeItem(ROLE_KEY);
      localStorage.removeItem(USERNAME_KEY);
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

  // Enhanced methods for compatibility with existing components
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): Role | null {
    return this.getRole();
  }

  isAdmin(): boolean {
    return this.getRole() === Role.Admin;
  }

  isUser(): boolean {
    return this.getRole() === Role.User;
  }

  getAllUsers(): User[] {
    return users;
  }

  getCurrentUserDisplayName(): string {
    const user = this.getCurrentUser();
    return user ? user.username : 'User';
  }

  getCurrentUserFullName(): string {
    const user = this.getCurrentUser();
    return user ? user.username : 'Unknown User';
  }

  updateUserStatus(userId: string, isActive: boolean): boolean {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].isActive = isActive;
      return true;
    }
    return false;
  }

  // Async compatibility method
  loginAsync(username: string, password: string): Observable<{ success: boolean; user?: User; message?: string }> {
    const role = this.login(username, password);
    const user = users.find(u => u.username === username && u.password === password && u.isActive);
    
    if (role && user) {
      return of({ success: true, user });
    }
    
    const message = this.lastError === 'INACTIVE' ? 'User account is inactive' : 'Invalid username or password';
    return of({ success: false, message });
  }

  private loadUserFromStorage(): void {
    if (this.isBrowser) {
      const storedUser = localStorage.getItem('currentUser');
      const storedRole = localStorage.getItem(ROLE_KEY);
      const storedUsername = localStorage.getItem(USERNAME_KEY);
      
      if (storedUser && storedRole && storedUsername) {
        try {
          const user: User = JSON.parse(storedUser);
          
          // Validate user data integrity
          if (!user.username || !user.role || user.username !== storedUsername || user.role !== storedRole) {
            this.logout();
            return;
          }
          
          // Verify user still exists and is active in the system
          const currentUser = users.find(u => u.username === user.username && u.isActive);
          if (!currentUser) {
            this.logout();
            return;
          }
          
          this.currentUserSubject.next(user);
          this.roleCache = storedRole as Role;
          this.usernameCache = storedUsername;
        } catch (error) {
          this.logout();
        }
      }
    }
  }
}
