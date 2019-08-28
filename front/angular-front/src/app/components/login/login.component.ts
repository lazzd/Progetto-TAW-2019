import { Component, OnInit } from '@angular/core';
// for routing
import { Router } from "@angular/router"

import { JwtHelperService } from '@auth0/angular-jwt';

// import Services
import { LoginService } from '../../services/login/login.service';
// import Class
import { Login } from '../../classes/login';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form_login: FormGroup;

  erroreLungPass: boolean;
  erroreLungMail: boolean;
  erroreMail: boolean;
  erroreVuoto: boolean;
  erroreLog: boolean;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private jwt: JwtHelperService) { }

  ngOnInit() {
    this.form_login = new FormGroup({
      emailLogin: new FormControl(),
      passwordLogin: new FormControl()
    })
  }

  returnAuth(): void {
    this.router.navigate(['/auth']);
  }

  sendLogin(): void {

    this.erroreVuoto = false;
    this.erroreLungPass = false;
    this.erroreMail = false;
    this.erroreLungMail = false;
    this.erroreLog = false;

    const email = this.form_login.value.emailLogin;
    const password = this.form_login.value.passwordLogin;

    if (email && password) {
      this.loginService.sendLogin({ email, password } as Login)
        .subscribe(
          (res: any) => {
            const name = this.jwt.decodeToken(res.AccessToken).name;
            const task = this.jwt.decodeToken(res.AccessToken).task;
            localStorage.setItem('AccessToken', res.AccessToken);
            localStorage.setItem('RefreshToken', res.RefreshToken);
            localStorage.setItem('UserName', name);
            localStorage.setItem('UserTask', task);
            console.log('ACCESS: ', res.AccessToken);
            console.log('REFRESH: ', res.RefreshToken);
            this.router.navigate(['/user']);
          },
          (err: any) => {
            // text con errori
            console.log(err.error);
            if (err.error === '"email" length must be at least 6 characters long') {
              this.erroreLungMail = true;
            }
            if (err.error === '"email" must be a valid email') {
              this.erroreMail = true;
            }
            if (err.error === '"password" length must be at least 6 characters long') {
              this.erroreLungPass = true;
            }
            if (err.error === 'Email or Password is wrong' || err.error === 'Invalid password') {
              this.erroreLog = true;
            }
          });
    }
    else {
      // text con errori con cambi non presenti
      this.erroreVuoto = true;
    }
  }

}
