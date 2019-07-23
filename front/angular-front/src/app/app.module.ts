import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// httpModule
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

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
    UserMainComponent
  ],
  imports: [
    BrowserModule,
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
