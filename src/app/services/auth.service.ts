import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { users, Role } from '../data/mock-users';

const ROLE_KEY = 'role';
const USERNAME_KEY = 'username';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private roleCache: Role | null = null;
  private usernameCache: string | null = null;
  login(username: string, password: string): Role | null {
    const u = users.find(x => x.username === username && x.password === password && x.isActive);
    if (!u) return null;
    this.roleCache = u.role;
    this.usernameCache = u.username;
    if (this.isBrowser)
    localStorage.setItem(ROLE_KEY, u.role);
    localStorage.setItem(USERNAME_KEY, u.username);
    return u.role;
  }

  logout(): void {
    this.roleCache = null;
    if (this.isBrowser) 
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USERNAME_KEY); 
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
}
