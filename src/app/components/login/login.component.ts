import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../data/mock-users';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
msg = '';

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submit() {
    if (this.form.invalid) {
      this.msg = 'Please fill all fields';
      return;
    }
    const { username, password } = this.form.value as { username: string; password: string };
    const role = this.auth.login(username, password);
    if (!role) {
      this.msg = 'Invalid credentials';
      return;
    }
    // redirect by role
    this.router.navigate([role === 'Admin' ? '/admin' : '/user']);
  }
}
