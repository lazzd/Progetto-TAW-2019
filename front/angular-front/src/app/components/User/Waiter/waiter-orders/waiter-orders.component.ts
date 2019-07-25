import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Tasks } from 'src/app/components/register/register.component';

import { WaiterOrdersService } from '../../../../services/User/Waiter/waiter-orders/waiter-orders.service';

// for routing
import { Router } from "@angular/router";
import { Table } from 'src/app/classes/table';
import { Menu } from 'src/app/classes/menu';

@Component({
  selector: 'app-waiter-orders',
  templateUrl: './waiter-orders.component.html',
  styleUrls: ['./waiter-orders.component.scss']
})
export class WaiterOrdersComponent implements OnInit {

  tasks: Tasks[] = [
    { value: 'waiter', viewValue: 'Cameriere' },
    { value: 'cook', viewValue: 'Cuoco' },
    { value: 'barman', viewValue: 'Barista' },
    { value: 'cashier', viewValue: 'Cassiere' }
  ];

  view_menu: Boolean;
  // stesso numero di let
  view_category: Boolean[];

  form_my_tables: FormGroup;
  myTables: Table[];
  completeMenu: Menu[];

  constructor(
    private waiterOrdersService: WaiterOrdersService,
    private router: Router) { }

  ngOnInit() {
    this.form_my_tables = new FormGroup({
      my_table: new FormControl()
    });
    this.myTables = [];
    this.completeMenu = [];
    this.view_menu = false;
    this.view_category = [];
    this.getTablesByWaiter();
  }

  async getTablesByWaiter(): Promise<void> {
    try {
      let WaiterOrdersServicePromise = await this.waiterOrdersService.getTablesByWaiter(localStorage.getItem('UserName'));
      // ritorna l'observable...
      WaiterOrdersServicePromise.subscribe(
        (ResSub => {
          // L'AccessToken è valido: o perchè NON era scaduto oppure perchè il refresh è avvenuto in maniara corretta
          if (ResSub.length == 0) {
            //this.view_tables = false;
          }
          else {
            console.log(ResSub);
            ResSub.forEach(element => {
              this.myTables.push(new Table(element));
            });
            console.log(this.myTables);
            //this.view_tables = true;
          }
        }),
        (ErrSub => {
          // necessario il catch della promise non gestisce l'errore dell'observable
          // E' avvenuto un errore con il refresh dell'AccessToken: è necessario un nuovo login
          this.router.navigate(['/auth/login']);
          // da andare in pagina di login
          console.log("SEND ORDER err", ErrSub);
        })
      )
    } catch (errorPromise) {
      this.router.navigate(['/auth/login']);
      // da andare in pagina di login, MA: sarebbe poi da fare un back a questa pagina quando si è fatto effettivamente il login
      console.log("sono qui");
      console.log("SEND ORDER err", errorPromise);
    }
  }

  async getMenu(): Promise<void> {
    try {
      let WaiterOrdersServicePromise = await this.waiterOrdersService.getMenu();
      // ritorna l'observable...
      WaiterOrdersServicePromise.subscribe(
        (ResSub => {
          //DA VEDERE SE IF null else NON fai nulla
          // L'AccessToken è valido: o perchè NON era scaduto oppure perchè il refresh è avvenuto in maniara corretta
          if (ResSub.length == 0) {
            //this.view_tables = false;
          }
          else {
            this.completeMenu = [];
            console.log(ResSub);
            let i = 1;
            ResSub.forEach(element => {
              this.completeMenu.push(new Menu(element));
              this.view_category[i++] = false;
            });
            console.log(this.completeMenu);
            this.view_menu = true;
            //this.view_tables = true;
          }
        }),
        (ErrSub => {
          // necessario il catch della promise non gestisce l'errore dell'observable
          // E' avvenuto un errore con il refresh dell'AccessToken: è necessario un nuovo login
          this.router.navigate(['/auth/login']);
          // da andare in pagina di login
          console.log("SEND ORDER err", ErrSub);
        })
      )
    } catch (errorPromise) {
      this.router.navigate(['/auth/login']);
      // da andare in pagina di login, MA: sarebbe poi da fare un back a questa pagina quando si è fatto effettivamente il login
      console.log("sono qui");
      console.log("SEND ORDER err", errorPromise);
    }
  }

  showCategory(i) {
    (this.view_category[i]) ? this.view_category[i] = false : this.view_category[i] = true;
    console.log(i);
  }

}
