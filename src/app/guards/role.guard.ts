import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.getRole();
  if (!role) return router.createUrlTree(['/auth/login']);

  const url = state.url || '';
  if (url.startsWith('/admin') && role !== 'Admin') return router.createUrlTree(['/user']);
  if (url.startsWith('/user')  && role !== 'User')  return router.createUrlTree(['/admin']);

  return true;
};

