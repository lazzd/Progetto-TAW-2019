import { Component, OnInit } from '@angular/core';
// for routing
import { Router } from "@angular/router"

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
    private router: Router) { }

  ngOnInit() {
  }

  sendRegister(name: string, email: string, password: string, task: string): void {
    if (name && email && password && task) {
      this.registerService.sendRegister({ name, email, password, task } as Register)
        .subscribe(
          (res: any) => {
            // anche con la registrazione devo mandare il token...
            localStorage.setItem('AccessToken', res.AccessToken);
            localStorage.setItem('RefreshToken', res.RefreshToken);
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
