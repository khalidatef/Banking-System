import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { users,User, Role } from '../../mock_data';
@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent {
  users: User[] = [...users];
  Role = Role;
  showModal = false;
  isEdit = false;
  editIndex: number | null = null;
  formData: User = {
    id:'',
    username:'',
    password:'',
    role:Role.Admin,
    isActive:true,
    email:'',
    phone:''
  };
  
errorMessage: string | null = null;
successMessage: string | null = null;


  openAddUser() {
    this.isEdit = false;
    this.formData = {
      id: (this.users.length +1).toString(),
      username:'',
      password:'',
      role: Role.User,
      isActive: true,
      email :'',
      phone :''
    };
    this.showModal = true;
    this.errorMessage = null;
    this.successMessage = null;
  }

  openEditUser(user: User, index : number) {
    this.isEdit = true;
    this.editIndex = index;
    this.formData = {...user, password :''};
    this.showModal = true;
    this.errorMessage = null;
    this.successMessage = null;
  }

saveUser() {
    this.errorMessage = null;
    this.successMessage = null;
    const existsUser = this.users.find(
      (u, i) =>
        i !== this.editIndex &&
        (u.username.toLowerCase() === this.formData.username.toLowerCase() 
      
    ));

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

    setTimeout(() => this.closeModal(), 1200);
  }
  closeModal() {
    this.showModal = false;
    this.errorMessage = null;
    this.successMessage= null;
  }
  deleteUser(index: number) {
    this.users.splice(index,1);
    this.successMessage = 'User deleted successfully!'
  
  }

}
