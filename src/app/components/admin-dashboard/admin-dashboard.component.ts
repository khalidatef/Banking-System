import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  constructor(private _AuthService: AuthService) {}
  get username(): string | null {
    return this._AuthService.getUsername();
  }
  get role(): 'Admin' | 'User' | null {
    return this._AuthService.getRole();
  }
}
