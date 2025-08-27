import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../shared/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide = true; // toggle password visibility

  // Reactive login form
  form = this.fb.group({
    userName: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(5)]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private sb: MatSnackBar
  ) {}
  // Handle form submit
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // highlight invalid fields
      return;
    }
   const { userName, password } = this.form.value as { userName: string; password: string };

    this.auth.login(userName, password).subscribe({
      next: (session) => {
        this.sb.open('Signed in successfully', 'OK', { duration: 1500 });
        // Redirect based on role
        const role = session.role;
        this.router.navigate([role === 'Admin' ? '/admin' : '/user']);
      },
      error: (e) => {
        this.sb.open(e.message || 'Invalid login', 'Dismiss', { duration: 2000 });
      }
    });
  }
}
