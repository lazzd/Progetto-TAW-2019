import { Component, OnInit } from '@angular/core';
// for routing
import { Router } from "@angular/router"

import { JwtHelperService } from '@auth0/angular-jwt';

// import Services
import { RegisterService } from '../../services/register/register.service';
// import Class
import { Register } from '../../classes/register';

export interface Tasks {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  tasks: Tasks[] = [
    { value: 'waiter', viewValue: 'Cameriere' },
    { value: 'cook', viewValue: 'Cuoco' },
    { value: 'barman', viewValue: 'Barista' },
    { value: 'cashier', viewValue: 'Cassiere' }
  ];

  constructor(
    private registerService: RegisterService,
    private router: Router,
    private jwt: JwtHelperService) { }

  ngOnInit() {
  }

  sendRegister(name: string, email: string, password: string, task: string): void {
    if (name && email && password && task) {
      this.registerService.sendRegister({ name, email, password, task } as Register)
        .subscribe(
          (res: any) => {
            const name = this.jwt.decodeToken(res.AccessToken).name;
            const task = this.jwt.decodeToken(res.AccessToken).task;
            // anche con la registrazione devo mandare il token...
            localStorage.setItem('AccessToken', res.AccessToken);
            localStorage.setItem('RefreshToken', res.RefreshToken);
            localStorage.setItem('UserName', name);
            localStorage.setItem('UserTask', task);
            console.log('ACCESS: ', res.AccessToken);
            console.log('REFRESH: ', res.RefreshToken);
            this.router.navigate(['/user']);
          },
          (err: any) => {
            // text con errori DA SERVER
            console.log(err.error);
          });
    }
    else {
      // text con errori con cambi non presenti
      console.log(name, email, password, task);
    }
  }
}
