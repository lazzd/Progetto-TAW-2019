import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { WaiterOrdersService } from '../../../../services/User/Waiter/waiter-orders/waiter-orders.service';

// for routing
import { Router } from "@angular/router";
import { Table } from 'src/app/classes/table';
import { Menu } from 'src/app/classes/menu';
import { ElementMenu } from 'src/app/classes/element_menu';

@Component({
  selector: 'app-waiter-orders',
  templateUrl: './waiter-orders.component.html',
  styleUrls: ['./waiter-orders.component.scss']
})
export class WaiterOrdersComponent implements OnInit {

  panelOpenState = false;

  view_menu: Boolean;

  // view_form_element_order_element_order
  form_element_order: FormGroup[][];

  form_my_tables: FormGroup;
  myTables: Table[];
  completeMenu: Menu[];

  view_recap_order: Boolean;

  drinks_order: ElementMenu[];
  foods_order: ElementMenu[];

  // devo avere due oggetti, che li carico... la presenza dell'id_order la ho direttamente in myTables
  // metodo unico con bottone: invia ordine che discrimina se fare una post (create new order) oppure una put (update), grazie all'id

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
    this.form_element_order = [];
    this.view_recap_order = false;
    this.drinks_order = [];
    this.foods_order = [];
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
            // ri azzero gli array degli ordini
            this.drinks_order = [];
            this.foods_order = [];
            this.completeMenu = [];
            console.log(ResSub);
            let i = 0;
            ResSub.forEach(element => {
              this.completeMenu.push(new Menu(element));
              this.form_element_order[i] = [];
              let u = 0;
              element.elements_category.forEach(_ => {
                this.form_element_order[i][u++] = new FormGroup({
                  add_element_order: new FormControl()
                })
              });
              i++;
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

  addElementOrder(i, u) {
    const num = this.form_element_order[i][u].value.add_element_order;
    if (num) {
      //console.log(this.completeMenu[i].elements_category[u]);
      //console.log(num);
      const cpy_ElementOrder = new ElementMenu(this.completeMenu[i].elements_category[u]);
      cpy_ElementOrder.quantity = num;
      if (cpy_ElementOrder.type == "drink")
        this.drinks_order.push(cpy_ElementOrder);
      if (cpy_ElementOrder.type == "food")
        this.foods_order.push(cpy_ElementOrder);
      if(this.drinks_order.length>0 ||this.foods_order.length>0)
        this.view_recap_order = true;
      console.log("DRINKS", this.drinks_order);
      console.log("FOOD", this.foods_order);
    }
  }

}
