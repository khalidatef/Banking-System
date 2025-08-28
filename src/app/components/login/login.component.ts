import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private router: Router) {}

  onSubmit() {
    // Simple demo login logic
    if ((this.username === 'admin' && this.password === 'admin123') || 
        (this.username === 'user1' && this.password === 'user123')) {
      
      // Route to appropriate dashboard
      if (this.username === 'admin') {
        this.router.navigate(['/admin/admin-home']);
      } else {
        this.router.navigate(['/user/user-home']);
      }
    } else {
      alert('Invalid credentials. Please try the demo credentials.');
    }
  }

  loginAsAdmin() {
    this.username = 'admin';
    this.password = 'admin123';
  }

  loginAsUser() {
    this.username = 'user1';
    this.password = 'user123';
  }
}
