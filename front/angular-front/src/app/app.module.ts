import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';

// httpModule
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// angular JWT
import { JwtModule } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AppRoutingModule } from './app-routing.module';
import { OrderComponent } from './components/order/order.component';
import { InitComponent } from './components/init/init.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { UserBarmanComponent } from './components/user-barman/user-barman.component';
import { UserMainComponent } from './components/User/user-main/user-main.component';
import { SidenavWaiterComponent } from './components/User/Waiter/sidenav-waiter/sidenav-waiter.component';
import { WaiterComponent } from './components/User/Waiter/waiter/waiter.component';
import { WaiterTablesComponent } from './components/User/Waiter/waiter-tables/waiter-tables.component';
import { SidenavBarmanComponent } from './components/User/Barman/sidenav-barman/sidenav-barman.component';
import { BarmanComponent } from './components/User/Barman/barman/barman.component';
import { WaiterOrdersComponent } from './components/User/Waiter/waiter-orders/waiter-orders.component';
import { BarmanFreeSubordersComponent } from './components/User/Barman/barman-free-suborders/barman-free-suborders.component';
import { BarmanMySubordersComponent } from './components/User/Barman/barman-my-suborders/barman-my-suborders.component';
import { CookComponent } from './components/User/Cook/cook/cook.component';
import { SidenavCookComponent } from './components/User/Cook/sidenav-cook/sidenav-cook.component';
import { CookFreeSubordersComponent } from './components/User/Cook/cook-free-suborders/cook-free-suborders.component';
import { CookMySubordersComponent } from './components/User/Cook/cook-my-suborders/cook-my-suborders.component';

export function tokenGetter() {
  //console.log(localStorage.getItem('AccessToken'))
  return localStorage.getItem('AccessToken');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AuthComponent,
    OrderComponent,
    InitComponent,
    SidenavComponent,
    UserBarmanComponent,
    UserMainComponent,
    SidenavWaiterComponent,
    WaiterComponent,
    WaiterTablesComponent,
    SidenavBarmanComponent,
    BarmanComponent,
    WaiterOrdersComponent,
    BarmanFreeSubordersComponent,
    BarmanMySubordersComponent,
    CookComponent,
    SidenavCookComponent,
    CookFreeSubordersComponent,
    CookMySubordersComponent
  ],
  imports: [
    BrowserModule,
    // Form Modules
    FormsModule,
    ReactiveFormsModule,
    // Radio Modules
    MatRadioModule,
    MatExpansionModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ["localhost:3000"],
        blacklistedRoutes: ["example.com/examplebadroute/"],
        headerName: "auth-token",
        authScheme: ""
      }
    }),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
