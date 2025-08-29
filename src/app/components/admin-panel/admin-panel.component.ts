import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface User {
  username: string;
  email: string;
  phone: string;
  role: 'Admin' | 'User';
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent {
  users: User[] = [
    {
      username: 'admin',
      email: 'admin@bank.com',
      phone: '+1234567890',
      role: 'Admin',
      status: 'Active',
    },
    {
      username: 'user1',
      email: 'user1@bank.com',
      phone: '+1234567891',
      role: 'User',
      status: 'Active',
    },
    {
      username: 'user2',
      email: 'user2@bank.com',
      phone: '+1234567892',
      role: 'User',
      status: 'Active',
    },
    {
      username: 'user3',
      email: 'user3@bank.com',
      phone: '+1234567893',
      role: 'User',
      status: 'Inactive',
    },
  ];

  toggleStatus(user: User): void {
    user.status = user.status === 'Active' ? 'Inactive' : 'Active';
  }
  editUser(user: any) {
    alert(`Editing user: ${user.username}`);
  }

  deleteUser(user: any) {
    this.users = this.users.filter((u) => u.username !== user.username);
  }
}
