import { Component, OnInit } from '@angular/core';
// for routing
import { Router } from "@angular/router"

import { JwtHelperService } from '@auth0/angular-jwt';

const presetTasks: string[] = ['waiter', 'barman', 'cook', 'cashier'];

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(
    private router: Router,
    private jwt: JwtHelperService) { }

  ngOnInit() {
    // il navigate dovrebbe bastare questa per la presenza del Guard
    //da ricordare che da scaduto faccia anche il logout automatico
    const task = this.jwt.decodeToken(localStorage.getItem('AccessToken')).task;
    (task && presetTasks.includes(task)) ? this.router.navigate(['/user/' + task]) : this.router.navigate(['/auth']);
  }

}