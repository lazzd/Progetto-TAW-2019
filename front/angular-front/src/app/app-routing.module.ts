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
import { WaiterArrivalComponent } from './components/User/Waiter/waiter-arrival/waiter-arrival.component';

// User Barman
import { BarmanComponent } from './components/User/Barman/barman/barman.component';
import { BarmanFreeSubordersComponent } from './components/User/Barman/barman-free-suborders/barman-free-suborders.component';
import { BarmanMySubordersComponent } from './components/User/Barman/barman-my-suborders/barman-my-suborders.component';
import { UserBarmanComponent } from './components/user-barman/user-barman.component';

// User Cook
import { CookComponent } from './components/User/Cook/cook/cook.component';
import { CookFreeSubordersComponent } from './components/User/Cook/cook-free-suborders/cook-free-suborders.component';
import { CookMySubordersComponent } from './components/User/Cook/cook-my-suborders/cook-my-suborders.component';

// User Cashier
import { CashierComponent } from './components/User/Cashier/cashier/cashier.component';
import { CashierBillComponent } from './components/User/Cashier/cashier-bill/cashier-bill.component';
import { CashierTablesComponent } from './components/User/Cashier/cashier-tables/cashier-tables.component';
import { CashierOrdersComponent } from './components/User/Cashier/cashier-orders/cashier-orders.component';
import { CashierStatisticsComponent } from './components/User/Cashier/cashier-statistics/cashier-statistics.component';
import { CashierReceiptsComponent } from './components/User/Cashier/cashier-receipts/cashier-receipts.component';

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
      },
      {
        path: 'arrival',
        component: WaiterArrivalComponent
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
        path: 'free-suborders',
        component: BarmanFreeSubordersComponent
      },
      {
        path: 'my-suborders',
        component: BarmanMySubordersComponent
      }
    ]
  },
  {
    path: 'user/cook',
    component: CookComponent,
    canActivate: [RoleGuard],
    data: {
      expectedTask: 'cook'
    },
    children: [
      {
        path: 'free-suborders',
        component: CookFreeSubordersComponent
      },
      {
        path: 'my-suborders',
        component: CookMySubordersComponent
      }
    ]
  },
  {
    path: 'user/cashier',
    component: CashierComponent,
    canActivate: [RoleGuard],
    data: {
      expectedTask: 'cashier'
    },
    children: [
      {
        path: 'bills',
        component: CashierBillComponent
      },
      {
        path: 'tables',
        component: CashierTablesComponent
      },
      {
        path: 'orders',
        component: CashierOrdersComponent
      },
      {
        path: 'statistics',
        component: CashierStatisticsComponent
      },
      {
        path: 'receipts',
        component: CashierReceiptsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }