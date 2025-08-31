import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { users, Role } from '../../data/mock-users';
import { User } from '../../data/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent {
  users: User[] = users;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  Role = Role;
  showModal = false;
  isEdit = false;
  editIndex: number | null = null;
  formData: User = {
    id: '',
    username: '',
    password: '',
    role: Role.Admin,
    isActive: true,
    email: '',
    phone: '',
  };
  openEditUser(user: User, index: number) {
    this.isEdit = true;
    this.editIndex = index;
    this.formData = { ...user, password: '' };
    this.showModal = true;
    this.errorMessage = null;
    this.successMessage = null;
  }
  clearAddUserForm(): void {
    this.formData = {
      id: (this.users.length + 1).toString(),
      username: '',
      password: '',
      role: Role.User,
      isActive: true,
      email: '',
      phone: '',
    };
  }
  saveUser() {
    this.errorMessage = null;
    this.successMessage = null;

    const existsUser = this.users.find(
      (u, i) =>
        i !== this.editIndex &&
        u.username.toLowerCase() === this.formData.username.toLowerCase()
    );

    if (existsUser) {
      this.errorMessage = `User already exists and the current role is: ${existsUser.role} `;
      return;
    }

    if (this.isEdit && this.editIndex !== null) {
      this.users[this.editIndex] = { ...this.formData };
      this.successMessage = '✅ User updated successfully!';
    } else {
      this.users.push({ ...this.formData });
      this.successMessage = '✅ User added successfully!';
    }
    localStorage.setItem('users', JSON.stringify(this.users));
    setTimeout(() => this.closeModal(), 2000);
  }

  closeModal() {
    this.showModal = false;
    this.errorMessage = null;
    this.successMessage = null;
  }

  displayUsers(): void {
    const saved = localStorage.getItem('users');
    if (saved) {
      this.users = JSON.parse(saved);
    } else {
      this.users = users;
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }
  ngOnInit(): void {
    this.displayUsers();
  }
  toggleStatus(user: User): void {
    user.isActive = !user.isActive;
    localStorage.setItem('users', JSON.stringify(this.users));
    this.users = [...this.users];
  }
  deleteUser(id: string) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }
}
