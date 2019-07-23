import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InitComponent } from './components/init/init.component';
import { AuthComponent } from './components/auth/auth.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { OrderComponent } from './components/order/order.component';

// User
import { UserMainComponent } from './components/User/user-main/user-main.component';
// User Barista
import { UserBarmanComponent } from './components/user-barman/user-barman.component';

// import AuthGuard Service for Guard Routing
import { AuthGuardService as AuthGuard } from './services/authGuard/auth-guard.service';

// per le categorie, usare i childer, più app-router

const routes: Routes = [
  {
    path: '',
    component: InitComponent
  },
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: 'auth/register',
    component: RegisterComponent
  },
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: 'orders',
    component: OrderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    component: UserMainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'barman',
        component: UserBarmanComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }