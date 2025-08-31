import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { UserStoreService } from '../../services/user-store.service';
import { Iuser } from '../../data/userInterface';
import { Role } from '../../data/mock-users';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  constructor(private fb: FormBuilder, private userStore: UserStoreService) {}

  message = '';
  messageType: 'success' | 'error' | 'warning' | '' = '';
  currentEditId: string | null = null;
  users: Iuser[] = [];

  ngOnInit(): void {
    this.displayUsers();
  }

  displayUsers(): void {
    this.users = this.userStore.getAll();
  }

  addUserForm = this.fb.nonNullable.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
      ],
    ],
    phone: [
      '',
      [Validators.required, Validators.pattern(/^\+1\d{10}$/)],
    ],
    Role: ['User' as Role, [Validators.required]],
  });

  EditUserForm = this.fb.nonNullable.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
      ],
    ],
    phone: ['', [Validators.required, Validators.pattern(/^\+1\d{10}$/)]],
    Role: ['User' as Role, [Validators.required]],
  });

  formreset() {
    this.addUserForm.reset({
      userName: '',
      password: '',
      email: '',
      phone: '',
      Role: 'User' as Role,
    });
  }

  addUser(): void {
    if (this.addUserForm.invalid) {
      this.addUserForm.markAllAsTouched();
      this.message = 'Please fix the highlighted fields.';
      this.messageType = 'error';
      return;
    }

    const v = this.addUserForm.getRawValue();

    const isExist = this.users.some(
      (u) =>
        u.username === v.userName ||
        u.email.toLowerCase() === v.email.toLowerCase() ||
        u.phone === v.phone
    );
    if (isExist) {
      this.message = '⚠️ User already exists!';
      this.messageType = 'error';
      return;
    }

    this.userStore.add({
      username: v.userName,
      password: v.password,
      email: v.email,
      phone: v.phone,
      role: v.Role as Role,
      isActive: true,
    });

    this.displayUsers();
    this.formreset();
    this.message = '✅ User added successfully!';
    this.messageType = 'success';
    setTimeout(() => (this.message = ''), 2000);
  }

  openEditUser(user: Iuser, id: string | number) {
    const idStr = String(id);
    this.currentEditId = idStr;

    this.EditUserForm.setValue({
      userName: user.username,
      password: user.password,
      email: user.email,
      phone: user.phone,
      Role: user.role as Role,
    });
  }

  onUpdateUser() {
    if (this.EditUserForm.invalid || !this.currentEditId) {
      this.EditUserForm.markAllAsTouched();
      this.message = 'Please fix the highlighted fields.';
      this.messageType = 'error';
      return;
    }

    const v = this.EditUserForm.getRawValue();
    const idx = this.users.findIndex((u) => u.id === this.currentEditId);
    if (idx === -1) return;

    const old = this.users[idx];
    const isSame =
      old.username === v.userName &&
      old.password === v.password &&
      old.email.toLowerCase() === v.email.toLowerCase() &&
      old.phone === v.phone &&
      old.role === v.Role;

    if (isSame) {
      this.message = '⚠️ No changes were made!';
      this.messageType = 'warning';
      setTimeout(() => (this.message = ''), 2000);
      return;
    }

    this.userStore.update(this.currentEditId, {
      username: v.userName,
      password: v.password,
      email: v.email,
      phone: v.phone,
      role: v.Role as Role,
    });

    this.displayUsers();
    this.message = '✅ User updated successfully!';
    this.messageType = 'success';
    setTimeout(() => (this.message = ''), 2000);
  }

  toggleStatus(id: string | number): void {
    const idStr = String(id);
    const u = this.users.find((x) => x.id === idStr);
    if (!u) return;

    this.userStore.update(idStr, { isActive: !u.isActive });
    this.displayUsers();
  }

  deleteUser(id: string | number) {
    this.userStore.remove(String(id));
    this.displayUsers();
  }
}
