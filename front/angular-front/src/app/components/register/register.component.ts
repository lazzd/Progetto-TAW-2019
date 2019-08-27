import { Component, OnInit } from '@angular/core';
// for routing
import { Router } from "@angular/router"

import { JwtHelperService } from '@auth0/angular-jwt';

// import Services
import { RegisterService } from '../../services/register/register.service';
// import Class
import { Register } from '../../classes/register';
import { FormGroup, FormControl } from '@angular/forms';

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

  form_reg: FormGroup;
  erroreLungPass: boolean;
  erroreLungMail: boolean;
  erroreMail: boolean;
  erroreNomeEsistente: boolean;
  regCompletata: boolean;
  erroreVuoto: boolean;
  erroreMailEsistente: boolean;
  erroreLungNome: boolean;

  constructor(
    private registerService: RegisterService,
    private router: Router,
    private jwt: JwtHelperService) { }

  ngOnInit() {
    this.form_reg = new FormGroup({
      nameRegister: new FormControl(),
      emailRegister: new FormControl(),
      passwordRegister: new FormControl(),
      taskRegister: new FormControl()
    })
  }

  sendRegister(): void {

    this.erroreNomeEsistente = false;
    this.erroreMailEsistente = false;
    this.erroreVuoto = false;
    this.erroreLungPass = false;
    this.erroreMail = false;
    this.regCompletata = false;
    this.erroreLungMail = false;
    this.erroreLungNome = false;

    const name = this.form_reg.value.nameRegister;
    const email = this.form_reg.value.emailRegister;
    const password = this.form_reg.value.passwordRegister;
    const task = this.form_reg.value.taskRegister;


    if (name && email && password && task) {
      this.registerService.sendRegister({ name, email, password, task } as Register)
        .subscribe(
          (res: any) => {

            this.form_reg.reset();
            this.regCompletata = true;

          },
          (err: any) => {

            if (err.error === 'Name already exists') {
              this.erroreNomeEsistente = true;
            }
            else if (err.error === 'Email already exists') {
              this.erroreMailEsistente = true;
            }
            else if (err.error === '"name" length must be at least 6 characters long') {
              this.erroreLungNome = true;
            }
            else if (err.error === '"email" length must be at least 6 characters long') {
              this.erroreLungMail = true;
            }
            else if (err.error === '"email" must be a valid email') {
              this.erroreMail = true;
            }
            else if (err.error === '"password" length must be at least 6 characters long') {
              this.erroreLungPass = true;
            }
            // text con errori DA SERVER
            console.log(err.error);
          });
    }
    else {
      // text con errori con cambi non presenti
      this.erroreVuoto = true;
    }
  }
}
