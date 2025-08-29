import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../enums';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check role-based access
    const requiredRole = route.data['role'] as UserRole;
    if (requiredRole) {
      const userRole = this.authService.getUserRole();
      
      if (userRole !== requiredRole) {
        // Redirect to appropriate dashboard based on actual role
        if (userRole === UserRole.Admin) {
          this.router.navigate(['/admin']);
        } else if (userRole === UserRole.User) {
          this.router.navigate(['/user']);
        } else {
          this.router.navigate(['/login']);
        }
        return false;
      }
    }

    return true;
  }
}
