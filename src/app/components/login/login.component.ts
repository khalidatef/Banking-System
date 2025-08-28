import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { users } from '../../data/mock-users';

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

   // pick first admin/user from the dataset
  demoAdmin = users.find(u => u.role === 'Admin');
  demoUser  = users.find(u => u.role === 'User');

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(3)]],
  });
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) { }

  // redirect if already logged in
  ngOnInit(): void {
    const role = this.auth.getRole();
    if (role === 'Admin') this.router.navigate(['/admin']);
    else if (role === 'User') this.router.navigate(['/user']);
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
      this.msg = 'Invalid credentials';
      this.loading = false;
      return;
    }

    // redirect by role
    this.router.navigate([role === 'Admin' ? '/admin' : '/user']).finally(() => {
      this.loading = false;
    });
  }

  // helpers for template
  get f() { return this.form.controls; }
}