import { Routes } from '@angular/router';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { FundTransferComponent } from './components/fund-transfer/fund-transfer.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { roleGuard } from './guards/role.guard';
import { loggedOutOnlyGuard } from './guards/logged-out-only.guard';
import { Role } from './data/mock-users';

export const routes: Routes = [
  // Redirect root to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Login route (public)
  { 
    path: 'login', 
    component: LoginComponent, 
    canActivate: [loggedOutOnlyGuard],
    title: 'Login - Bank Masr' 
  },
  
  // User routes (protected)
  {
    path: 'user',
    component: UserLayoutComponent,
    canActivate: [roleGuard],
    data: { role: Role.User },
    children: [
      { 
        path: '', 
        redirectTo: 'user-home', 
        pathMatch: 'full' 
      },
      { 
        path: 'user-home', 
        component: UserDashboardComponent, 
        title: 'Home - Bank Masr',
        data: { role: Role.User }
      },
      { 
        path: 'myAccount', 
        component: MyAccountComponent, 
        title: 'My Account - Bank Masr',
        data: { role: Role.User }
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
        title: 'Transactions - Bank Masr',
        data: { role: Role.User }
      },
      {
        path: 'fund-transfer',
        component: FundTransferComponent,
        title: 'Fund Transfer - Bank Masr',
        data: { role: Role.User }
      },
    ],
  },
  
  // Admin routes (protected)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [roleGuard],
    data: { role: Role.Admin },
    children: [
      { 
        path: '', 
        redirectTo: 'admin-home', 
        pathMatch: 'full' 
      },
      { 
        path: 'admin-home', 
        component: AdminDashboardComponent, 
        title: 'Admin Dashboard - Bank Masr',
        data: { role: Role.Admin }
      },
      {
        path: 'users',
        component: AdminPanelComponent,
        title: 'User Management - Bank Masr',
        data: { role: Role.Admin }
      },
      {
        path: 'accounts',
        component: MyAccountComponent,
        title: 'Account Management - Bank Masr',
        data: { role: Role.Admin }
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
        title: 'Transaction Monitor - Bank Masr',
        data: { role: Role.Admin }
      },
      {
        path: 'reports',
        component: AdminDashboardComponent,
        title: 'System Reports - Bank Masr',
        data: { role: Role.Admin }
      },
      {
        path: 'settings',
        component: AdminPanelComponent,
        title: 'System Settings - Bank Masr',
        data: { role: Role.Admin }
      },
      {
        path: 'security',
        component: AdminPanelComponent,
        title: 'Security Center - Bank Masr',
        data: { role: Role.Admin }
      },
      {
        path: 'admin-panel',
        component: AdminPanelComponent,
        title: 'Admin Panel - Bank Masr',
        data: { role: Role.Admin }
      },
    ],
  },
  
  // 404 page
  { 
    path: '**', 
    component: NotFoundComponent, 
    title: 'Page Not Found - Bank Masr' 
  },
];
