import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-nav.component.html',
  styleUrl: './admin-nav.component.css'
})
export class AdminNavComponent {
  constructor(private auth: AuthService, private router: Router) { }

  get username(): string | null { return this.auth.getUsername(); }
  get role(): 'Admin' | 'User' | null { return this.auth.getRole(); }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
