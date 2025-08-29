import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface User {
  id?: string;
  username: string;
  email: string;
  phone: string;
  role: 'Admin' | 'User';
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent {
  users: User[] = [
    {
      id: 'USR001',
      username: 'admin',
      email: 'admin@bank.com',
      phone: '+123-456-7890',
      role: 'Admin',
      status: 'Active',
    },
    {
      id: 'USR002',
      username: 'user1',
      email: 'user1@bank.com',
      phone: '+123-456-7891',
      role: 'User',
      status: 'Active',
    },
    {
      id: 'USR003',
      username: 'user2',
      email: 'user2@bank.com',
      phone: '+123-456-7892',
      role: 'User',
      status: 'Active',
    },
    {
      id: 'USR004',
      username: 'user3',
      email: 'user3@bank.com',
      phone: '+123-456-7893',
      role: 'User',
      status: 'Inactive',
    },
    {
      id: 'USR005',
      username: 'ahmed',
      email: 'ahmed@bank.com',
      phone: '+123-456-7894',
      role: 'User',
      status: 'Active',
    },
  ];

  showEditModal = false;
  selectedUser: User | null = null;

  // Statistics methods
  getTotalUsers(): number {
    return this.users.length;
  }

  getActiveUsers(): number {
    return this.users.filter(user => user.status === 'Active').length;
  }

  getInactiveUsers(): number {
    return this.users.filter(user => user.status === 'Inactive').length;
  }

  getAdminUsers(): number {
    return this.users.filter(user => user.role === 'Admin').length;
  }

  // User management methods
  toggleStatus(user: User): void {
    user.status = user.status === 'Active' ? 'Inactive' : 'Active';
  }

  editUser(user: User): void {
    this.selectedUser = { ...user };
    this.showEditModal = true;
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user: ${user.username}?`)) {
      this.users = this.users.filter((u) => u.username !== user.username);
    }
  }

  openAddUserModal(): void {
    // This would typically open an add user modal
    alert('Add User functionality would be implemented here');
  }

  // Modal methods
  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  saveUser(): void {
    if (this.selectedUser) {
      const index = this.users.findIndex(u => u.username === this.selectedUser!.username);
      if (index !== -1) {
        this.users[index] = { ...this.selectedUser };
      }
      this.closeEditModal();
    }
  }

  // Utility methods for styling
  getRoleClass(role: string): string {
    return role === 'Admin' ? 'admin-role' : 'user-role';
  }

  getRoleIcon(role: string): string {
    return role === 'Admin' ? 'fas fa-shield-alt me-2' : 'fas fa-user me-2';
  }

  getStatusClass(status: string): string {
    return status === 'Active' ? 'active-status' : 'inactive-status';
  }

  getStatusIndicator(status: string): string {
    return status === 'Active' ? 'active-indicator' : 'inactive-indicator';
  }

  trackByUsername(index: number, user: User): string {
    return user.username;
  }
}
