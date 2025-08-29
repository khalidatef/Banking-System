import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './components/login/login.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { FundTransferComponent } from './components/fund-transfer/fund-transfer.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { loggedOutOnlyGuard } from './guards/logged-out-only.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'user',
    component: UserLayoutComponent,
    canActivate: [roleGuard],
    data: { role: 'User' },
    children: [
      { path: '', redirectTo: 'user-home', pathMatch: 'full' },
      { path: 'user-home', component: UserDashboardComponent, title: 'Home' },
      { path: 'myAccount', component: MyAccountComponent, title: 'Myaccount' },
      {
        path: 'transactions',
        component: TransactionsComponent,
        title: 'Transactions',
      },
      {
        path: 'fund-transfer',
        component: FundTransferComponent,
        title: 'Fund-Transfer',
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [loggedOutOnlyGuard],
        title: 'Login',
      },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [roleGuard],
    data: { role: 'Admin' },
    children: [
      { path: '', redirectTo: 'admin-home', pathMatch: 'full' },
      { path: 'admin-home', component: AdminDashboardComponent, title: 'Home' },
      {
        path: 'admin-panel',
        component: AdminPanelComponent,
        title: 'Admin-Panel',
      },
    ],
  },
  { path: '**', component: NotFoundComponent, title: 'Error 404' },
];
