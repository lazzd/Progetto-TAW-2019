import { Component, OnInit } from '@angular/core';
// for routing
import { Router } from "@angular/router"

// import Services
import { LoginService } from '../../services/login/login.service';
// import Class
import { Login } from '../../classes/login';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private router: Router) { }

  ngOnInit() {
  }

  // salvo poi e metto nell'header...
  sendLogin(email: string, password: string): void {
    if (email && password) {
      this.loginService.sendLogin({ email, password } as Login)
        .subscribe(
          (res: any) => {
            localStorage.setItem('AccessToken', res.AccessToken);
            localStorage.setItem('RefreshToken', res.RefreshToken);
            console.log('ACCESS: ', res.AccessToken);
            console.log('REFRESH: ', res.RefreshToken);
            this.router.navigate(['/user']);
          },
          (err: any) => {
            // text con errori
            console.log(err.error);
          });
    }
    else {
      // text con errori con cambi non presenti
      console.log(email, password);
    }
  }

}
