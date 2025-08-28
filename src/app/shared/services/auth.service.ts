import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_USERS } from '../data/mock-users.data';

type Role = 'Admin' | 'User';
const KEY = 'bs_auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
login(userName: string, password: string) {
    const user = MOCK_USERS.find(
      u => u.userName === userName && u.password === password && u.isActive
    );
    if (!user) {
      return throwError(() => new Error('Invalid credentials or inactive user'));
    }
    const session = {
      token: 'mock-token',
      role: user.role,
      id: user.id,
      userName: user.userName
    };
    localStorage.setItem(KEY, JSON.stringify(session));
    return of(session).pipe(delay(200)); // simulate API delay
  }

  logout() { localStorage.removeItem(KEY); }

  isLoggedIn(): boolean { return !!localStorage.getItem(KEY); }

  get role(): Role | null {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw).role as Role) : null;
  }
}
