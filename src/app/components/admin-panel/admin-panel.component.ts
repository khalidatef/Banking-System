import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { users } from '../../data/mock-users';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent implements OnInit {
  constructor(private _FormBuilder: FormBuilder) {}
  message: string = '';
  messageType: 'success' | 'error' | 'warning' | '' = '';
  currentEditId: number | null = null;
  users: any[] = [];

  ngOnInit(): void {
    this.displayUsers();
  }

  displayUsers(): void {
    const storedData = localStorage.getItem('users');
    if (storedData) {
      this.users = JSON.parse(storedData);
    } else {
      localStorage.setItem('users', JSON.stringify(users));
      this.users = users;
    }
  }

  addUserForm = this._FormBuilder.group({
    userName: [null, [Validators.required]],
    password: [null, [Validators.required, Validators.minLength(3)]],
    email: [
      null,
      [
        Validators.required,
        Validators.email,
        Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
      ],
    ],
    phone: [
      null,
      [
        Validators.required,
        Validators.pattern('^(\\+201|01|00201)[0-2,5][0-9]{8}$'),
      ],
    ],
    Role: [null, [Validators.required]],
  });
  EditUserForm = this._FormBuilder.group({
    userName: [null, [Validators.required]],
    password: [null, [Validators.required, Validators.minLength(3)]],
    email: [
      null,
      [
        Validators.required,
        Validators.email,
        Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
      ],
    ],
    phone: [null, [Validators.required]],
    Role: [null, [Validators.required]],
  });

  formreset() {
    this.addUserForm.reset();
  }

  addUser(): void {
    if (this.addUserForm.valid) {
      const newUser = this.addUserForm.value;
      const isExist = this.users.some(
        (user) =>
          user.username === newUser.userName ||
          user.email === newUser.email ||
          user.phone === newUser.phone
      );

      if (isExist) {
        this.message = '⚠️ User already exists!';
        this.messageType = 'error';
        return;
      }
      const id =
        this.users.length > 0
          ? Math.max(...this.users.map((user) => user.id)) + 1
          : 1;
      const user = {
        id,
        username: newUser.userName,
        password: newUser.password,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.Role,
        isActive: true,
      };
      this.users.push(user);
      localStorage.setItem('users', JSON.stringify(this.users));
      this.displayUsers();
      this.formreset();
      this.message = '✅ User added successfully!';
      this.messageType = 'success';
      setTimeout(() => {
        this.message = '';
      }, 2000);
    } else {
      this.addUserForm.markAllAsTouched();
    }
  }

  openEditUser(user: any, id: number) {
    this.currentEditId = id;
    this.EditUserForm.patchValue({
      userName: user.username,
      email: user.email,
      phone: user.phone,
      Role: user.role,
    });
  }

  onUpdateUser() {
    if (this.EditUserForm.valid) {
      const updatedUser = this.EditUserForm.value;

      const index = this.users.findIndex((u) => u.id === this.currentEditId);

      if (index !== -1) {
        const oldUser = this.users[index];
        const isSame =
          oldUser.username === updatedUser.userName &&
          oldUser.password === updatedUser.password &&
          oldUser.email === updatedUser.email &&
          oldUser.phone === updatedUser.phone &&
          oldUser.role === updatedUser.Role;
          !updatedUser.password;

        if (isSame) {
          this.message = '⚠️ No changes were made!';
          this.messageType = 'warning';
          setTimeout(() => (this.message = ''), 2000);
          return;
        }
        if (index !== -1) {
          this.users[index] = {
            ...this.users[index],
            username: updatedUser.userName,
            password: updatedUser.password,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.Role,
          };

          localStorage.setItem('users', JSON.stringify(this.users));
          this.displayUsers();

          this.message = '✅ User Updated successfully!';
          this.messageType = 'success';

          setTimeout(() => {
            this.message = '';
          }, 2000);
        }
      } else {
        this.EditUserForm.markAllAsTouched();
      }
    }
  }
  toggleStatus(id: number): void {
    const index = this.users.findIndex((u) => u.id === id);

    if (index !== -1) {
      this.users[index].isActive = !this.users[index].isActive;
      localStorage.setItem('users', JSON.stringify(this.users));
    }
    this.displayUsers();
  }
  deleteUser(id: string) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      localStorage.setItem('users', JSON.stringify(this.users));
    }
    this.displayUsers();
  }
}
