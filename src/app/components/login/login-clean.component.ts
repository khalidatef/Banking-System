import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services';
import { Role } from '../../data/mock-users';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    // Check if already logged in
    if (this.authService.isLoggedIn()) {
      this.redirectUser();
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const { username, password } = this.loginForm.value;
      
      // Try to login
      const role = this.authService.login(username, password);
      
      this.isLoading = false;
      
      if (role) {
        // Success - redirect to appropriate dashboard
        this.redirectUser();
      } else {
        // Failed - show error
        this.errorMessage = this.authService.lastError === 'INACTIVE' 
          ? 'Account is inactive' 
          : 'Invalid username or password';
      }
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Demo account methods
  useAdminAccount(): void {
    this.loginForm.patchValue({
      username: 'admin',
      password: 'admin123'
    });
    this.errorMessage = '';
  }

  useUserAccount(): void {
    this.loginForm.patchValue({
      username: 'user1',
      password: 'user123'
    });
    this.errorMessage = '';
  }

  useAhmedAccount(): void {
    this.loginForm.patchValue({
      username: 'ahmed',
      password: 'ahmed123'
    });
    this.errorMessage = '';
  }

  private redirectUser(): void {
    const role = this.authService.getRole();
    if (role === Role.Admin) {
      this.router.navigate(['/admin']);
    } else if (role === Role.User) {
      this.router.navigate(['/user']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Helper methods
  hasError(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.capitalize(controlName)} is required`;
      }
    }
    return '';
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
