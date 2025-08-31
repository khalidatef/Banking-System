import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { users } from '../../data/mock-users';
import { UserStoreService } from '../../services/user-store.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  msg = '';
  loading = false;

  demoAdmin: { username: string; password: string } | null = null;
  demoUser:  { username: string; password: string } | null = null;

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private store: UserStoreService
  ) {}
  
   ngOnInit(): void {
    const all = this.store.getAll();
    const a = all.find(u => u.role === 'Admin');
    const u = all.find(u => u.role === 'User');

    this.demoAdmin = a ? { username: a.username, password: a.password } : null;
    this.demoUser  = u ? { username: u.username, password: u.password } : null;
  }

  submit() {
    this.msg = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { username, password } = this.form.value as { username: string; password: string };

    const role = this.auth.login(username, password); 

    if (!role) {
      this.msg = this.auth.lastError === 'INACTIVE'
        ? 'Account is inactive. Please contact the admin.'
        : 'Invalid username or password.';
      this.loading = false;
      return;
    }

    // route by role
    this.router
      .navigate([role === 'Admin' ? '/admin' : '/user'])
      .finally(() => (this.loading = false));
  }

  get f() { return this.form.controls; }
}