import { Routes } from '@angular/router';

export const routes: Routes = [
{
     path: '', pathMatch: 'full', redirectTo: 'auth/login'
},
{
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
},
{ 
    path: '**', redirectTo: 'auth/login'
}];
