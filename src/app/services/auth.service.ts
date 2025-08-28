import { Injectable } from '@angular/core';
import { users, Role } from '../data/mock-users';

const ROLE_KEY = 'role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login(username: string, password: string): Role | null {
    const u = users.find(x => x.username === username && x.password === password && x.isActive);
    if (!u) return null;
    localStorage.setItem(ROLE_KEY, u.role); // 'Admin' | 'User'
    return u.role;
  }

  logout(): void {
    localStorage.removeItem(ROLE_KEY);
  }

  getRole(): Role | null {
    const v = localStorage.getItem(ROLE_KEY);
    return v === 'Admin' || v === 'User' ? (v as Role) : null;
  }

  isLoggedIn(): boolean {
    return this.getRole() !== null;
  }
  constructor() { }
}
