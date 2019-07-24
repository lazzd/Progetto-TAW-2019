import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InitComponent } from './components/init/init.component';
import { AuthComponent } from './components/auth/auth.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { OrderComponent } from './components/order/order.component';

// User
import { UserMainComponent } from './components/User/user-main/user-main.component';

// User Waiter
import { WaiterComponent } from './components/User/Waiter/waiter/waiter.component';
import { WaiterTablesComponent } from './components/User/Waiter/waiter-tables/waiter-tables.component';
import { WaiterOrdersComponent } from './components/User/Waiter/waiter-orders/waiter-orders.component';

// User Barman
import { BarmanComponent } from './components/User/Barman/barman/barman.component';
import { UserBarmanComponent } from './components/user-barman/user-barman.component';

// import AuthGuard Service for Guard Routing
import { AuthGuardService as AuthGuard } from './services/authGuard/auth-guard.service';
import { RoleGuardService as RoleGuard } from './services/roleGuard/role-guard.service';

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
    canActivate: [AuthGuard]
  },
  {
    path: 'user/waiter',
    component: WaiterComponent,
    canActivate: [RoleGuard],
    data: {
      expectedTask: 'waiter'
    },
    children: [
      {
        path: 'tables',
        component: WaiterTablesComponent
      },
      {
        path: 'orders',
        component: WaiterOrdersComponent
      }
    ]
  },
  {
    path: 'user/barman',
    component: BarmanComponent,
    canActivate: [RoleGuard],
    data: {
      expectedTask: 'barman'
    },
    children: [
      {
        path: 'barman1',
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