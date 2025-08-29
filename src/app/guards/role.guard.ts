import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isLogged = auth.isLoggedIn();
  const role = auth.getRole(); 
  const expected = route.data?.['role'] as 'Admin' | 'User' | undefined;

  if (!isLogged) return router.parseUrl('/auth/login');

  if (expected && role !== expected) {
    return router.parseUrl(role === 'Admin' ? '/admin' : '/user');
  }

  return true;
};
