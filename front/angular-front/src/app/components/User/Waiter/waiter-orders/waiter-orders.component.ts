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

  view_menu: Boolean;
  // stesso numero di let
  view_category: Boolean[];
  
  // view_form_element_order_element_order
  view_form_element_order: Boolean[][];
  form_element_order: FormGroup[][];

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
    this.view_form_element_order = [];
    this.form_element_order = [];
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
            let i = 0;
            ResSub.forEach(element => {
              this.completeMenu.push(new Menu(element));
              this.view_form_element_order[i] = [];
              this.form_element_order[i] = [];
              let u = 0;
              element.elements_category.forEach(_ => {
                this.form_element_order[i][u++] = new FormGroup({
                  add_element_order: new FormControl()
                })
              })
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

  showForm(i, u){
    (this.view_form_element_order[i][u]) ? this.view_form_element_order[i][u] = false : this.view_form_element_order[i][u] = true;
    console.log(i, u);
  }

  addElementOrder(i, u){
    const num = this.form_element_order[i][u].value.add_element_order;
    if(num){
      console.log(this.completeMenu[i].elements_category[u]);
      console.log(num);
    }
  }

}
