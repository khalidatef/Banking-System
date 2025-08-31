import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Role } from '../data/mock-users';
import { Iuser } from '../data/userInterface';
import { UserStoreService } from './user-store.service';

const ROLE_KEY = 'role';
const USERNAME_KEY = 'username';
const USER_ID_KEY = 'user_id';

type AuthLastError = 'INACTIVE' | 'INVALID' | null;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private store: UserStoreService = inject(UserStoreService);
  private roleCache: Role | null = null;
  private usernameCache: string | null = null;
  private userIdCache: string | null = null;
  public lastError: AuthLastError = null;

  login(username: string, password: string): Role | null {
    const uName = (username ?? '').trim();
    const pWord = (password ?? '').trim();

    const recByName = this.store.getAll().find(x => x.username === uName);
    if (recByName && !recByName.isActive) {
      this.lastError = 'INACTIVE';
      return null;
    }

    const u = this.store.findByCredentials(uName, pWord);
    if (!u) {
      this.lastError = 'INVALID';
      return null;
    }

    this.lastError = null;
    this.roleCache = u.role;
    this.usernameCache = u.username;
    this.userIdCache = u.id;

    if (this.isBrowser) {
      localStorage.setItem(ROLE_KEY, u.role);
      localStorage.setItem(USERNAME_KEY, u.username);
      localStorage.setItem(USER_ID_KEY, u.id);
    }
    return u.role;
  }

  logout(): void {
    this.roleCache = null;
    this.usernameCache = null;
    this.userIdCache = null;
    if (this.isBrowser) {
      localStorage.removeItem(ROLE_KEY);
      localStorage.removeItem(USERNAME_KEY);
      localStorage.removeItem(USER_ID_KEY);
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

  getUserId(): string | null {
    if (this.isBrowser) return localStorage.getItem(USER_ID_KEY);
    return this.userIdCache;
  }

  isLoggedIn(): boolean {
    return this.getRole() !== null;
  }
}
