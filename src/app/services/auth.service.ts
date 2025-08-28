import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { users, Role } from '../data/mock-users';

const ROLE_KEY = 'role';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private roleCache: Role | null = null; 

  login(username: string, password: string): Role | null {
    const u = users.find(x => x.username === username && x.password === password && x.isActive);
    if (!u) return null;
    this.roleCache = u.role;
    if (this.isBrowser) localStorage.setItem(ROLE_KEY, u.role);
    return u.role;
  }

  logout(): void {
    this.roleCache = null;
    if (this.isBrowser) localStorage.removeItem(ROLE_KEY);
  }

  getRole(): Role | null {
    if (this.isBrowser) {
      const v = localStorage.getItem(ROLE_KEY);
      return v === 'Admin' || v === 'User' ? (v as Role) : null;
    }
    return this.roleCache; 
  }

  isLoggedIn(): boolean {
    return this.getRole() !== null;
  }
}
