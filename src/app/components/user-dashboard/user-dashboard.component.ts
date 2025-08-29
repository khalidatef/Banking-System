import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
})
export class UserDashboardComponent {
  constructor(private _AuthService: AuthService) {}
  get username(): string | null {
    return this._AuthService.getUsername();
  }
  get role(): 'Admin' | 'User' | null {
    return this._AuthService.getRole();
  }
}
