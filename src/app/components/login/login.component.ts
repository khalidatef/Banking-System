import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services';
import { UserRole } from '../../enums';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  passwordVisible = false;
  isDataLoading = false;
  loadingMessage = 'Signing in...';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkExistingLogin();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize the reactive form
   */
  private initializeForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Check if user is already logged in
   */
  private checkExistingLogin(): void {
    if (this.authService.isLoggedIn()) {
      this.redirectToAppropriateRoute();
    }
  }

  /**
   * Handle form submission with optimized loading states
   */
  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.startLogin();
      
      const { username, password } = this.loginForm.value;
      
      // Update loading message based on authentication method
      this.updateLoadingMessage(username);
      
      const startTime = performance.now();
      
      this.authService.login(username, password)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            const loginTime = performance.now() - startTime;
            console.log(`⏱️ Login completed in ${Math.round(loginTime)}ms`);
            
            this.stopLoading();
            
            if (response.success && response.user) {
              this.handleSuccessfulLogin(response.user.userName || username);
            } else {
              this.handleLoginError(response.message || 'Login failed. Please try again.');
            }
          },
          error: (error) => {
            const loginTime = performance.now() - startTime;
            console.error(`❌ Login failed in ${Math.round(loginTime)}ms:`, error);
            
            this.stopLoading();
            this.handleLoginError('An error occurred. Please try again.');
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }
  
  /**
   * Start login process with loading states
   */
  private startLogin(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.loadingMessage = 'Signing in...';
  }
  
  /**
   * Stop loading process
   */
  private stopLoading(): void {
    this.isLoading = false;
    this.isDataLoading = false;
  }
  
  /**
   * Update loading message based on authentication method
   */
  private updateLoadingMessage(username: string): void {
    const knownUsers = ['admin', 'ahmed', 'user1'];
    
    if (knownUsers.includes(username)) {
      this.loadingMessage = 'Fast authentication...';
    } else {
      this.loadingMessage = 'Verifying credentials...';
      this.isDataLoading = true;
    }
  }
  
  /**
   * Handle successful login
   */
  private handleSuccessfulLogin(username: string): void {
    this.loadingMessage = 'Welcome back!';
    
    // Brief success message before redirect
    setTimeout(() => {
      this.redirectToAppropriateRoute();
    }, 500);
  }
  
  /**
   * Handle login error
   */
  private handleLoginError(message: string): void {
    this.errorMessage = message;
    this.shakeForm();
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  /**
   * Auto-fill admin credentials
   */
  loginAsAdmin(): void {
    this.loginForm.patchValue({
      username: 'admin',
      password: 'admin123'
    });
  }

  /**
   * Auto-fill user credentials
   */
  loginAsUser(): void {
    this.loginForm.patchValue({
      username: 'user1',
      password: 'user123'
    });
  }

  /**
   * Auto-fill ahmed credentials
   */
  loginAsAhmed(): void {
    this.loginForm.patchValue({
      username: 'ahmed',
      password: 'ahmed123'
    });
  }

  /**
   * Get form control error message
   */
  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.capitalize(controlName)} is required`;
      }
      if (control.errors['minlength']) {
        const requiredLength = control.errors['minlength'].requiredLength;
        return `${this.capitalize(controlName)} must be at least ${requiredLength} characters`;
      }
    }
    return '';
  }

  /**
   * Check if form control has error
   */
  hasError(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  /**
   * Redirect to appropriate route based on user role
   */
  private redirectToAppropriateRoute(): void {
    const userRole = this.authService.getUserRole();
    
    if (userRole === UserRole.Admin) {
      this.router.navigate(['/admin']);
    } else if (userRole === UserRole.User) {
      this.router.navigate(['/user']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Mark all form controls as touched
   */
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  /**
   * Add shake animation to form
   */
  private shakeForm(): void {
    const formElement = document.querySelector('.login-form');
    if (formElement) {
      formElement.classList.add('shake');
      setTimeout(() => {
        formElement.classList.remove('shake');
      }, 600);
    }
  }

  /**
   * Capitalize first letter
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
