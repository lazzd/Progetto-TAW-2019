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

  view_btn_menu: Boolean;
  view_menu: Boolean;

  // view_form_element_order_element_order
  form_element_order: FormGroup[][];
  //breakpoint: number;
  form_my_tables: FormGroup;
  myTables: Table[];
  completeMenu: Menu[];

  selectedTable: Table;

  view_recap_order: Boolean;
  view_recap_drinks: Boolean;
  view_recap_foods: Boolean;

  drinks_order: ElementMenu[];
  foods_order: ElementMenu[];

  tot_sub_drinks: number;
  tot_sub_foods: number;

  // devo avere due oggetti, che li carico... la presenza dell'id_order la ho direttamente in myTables
  // metodo unico con bottone: invia ordine che discrimina se fare una post (create new order) oppure una put (update), grazie all'id

  constructor(
    private waiterOrdersService: WaiterOrdersService,
    private router: Router) { }

  ngOnInit() {
    this.form_my_tables = new FormGroup({
      my_table: new FormControl()
    });
    //this.breakpoint = (window.innerWidth <= 400) ? 1 : 6;
    this.myTables = [];
    this.completeMenu = [];
    this.view_btn_menu = false;
    this.view_menu = false;
    this.form_element_order = [];
    this.view_recap_order = false;
    this.view_recap_drinks = false;
    this.view_recap_foods = false;
    this.drinks_order = [];
    this.foods_order = [];
    this.tot_sub_drinks = 0;
    this.tot_sub_foods = 0;
    this.getTablesByWaiter();
  }

  /*
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 6;
  }
  */

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
            //for(let i=0;i<ResSub.length;++i)
            //this.myTables.push(new Table(ResSub[i]));
            ResSub.forEach(element => {
              this.myTables.push(new Table(element));
            });
            this.myTables.sort(function (a, b) {
              return parseInt(a.name_table) - parseInt(b.name_table);
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
      if (this.form_my_tables.value.my_table) {
        console.log("MIEI TAVOLI:", this.myTables);
        this.selectedTable = this.myTables.find(table => table.name_table == this.form_my_tables.value.my_table);
        console.log("MY TABLES", this.selectedTable);
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
              this.view_btn_menu = true;
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
      }
    } catch (errorPromise) {
      this.router.navigate(['/auth/login']);
      // da andare in pagina di login, MA: sarebbe poi da fare un back a questa pagina quando si è fatto effettivamente il login
      console.log("sono qui");
      console.log("SEND ORDER err", errorPromise);
    }
  }

  showMenu(): void {
    (this.view_menu) ? this.view_menu = false : this.view_menu = true;
  }

  addElementOrder(i, u) {
    const num = this.form_element_order[i][u].value.add_element_order;
    if (num) {
      //console.log(this.completeMenu[i].elements_category[u]);
      //console.log(num);
      const cpy_ElementOrder = new ElementMenu(this.completeMenu[i].elements_category[u]);
      cpy_ElementOrder.quantity = num;
      if (cpy_ElementOrder.type == "drink"){
        this.drinks_order.push(cpy_ElementOrder);
        this.tot_sub_drinks += num * cpy_ElementOrder.price;
      }
      if (cpy_ElementOrder.type == "food"){
        this.foods_order.push(cpy_ElementOrder);
        this.tot_sub_foods += num * cpy_ElementOrder.price;
      }
      if (this.drinks_order.length > 0) {
        this.view_recap_order = true;
        this.view_recap_drinks = true;
      }
      if (this.foods_order.length > 0) {
        this.view_recap_order = true;
        this.view_recap_foods = true;
      }
      console.log("DRINKS", this.drinks_order);
      console.log("FOOD", this.foods_order);
    }
  }

  removelementOrder(type: string, i: number) {
    console.log(type, i);
    if (type == 'food') {
      this.tot_sub_foods -= this.foods_order[i].quantity * this.foods_order[i].price;
      this.foods_order.splice(i, 1);
      if (!this.foods_order.length)
        this.view_recap_foods = false;
    }
    else {
      this.tot_sub_drinks -= this.drinks_order[i].quantity * this.drinks_order[i].price;
      this.drinks_order.splice(i, 1);
      if (!this.drinks_order.length)
        this.view_recap_drinks = false;
    }
    if (!this.view_recap_foods && !this.view_recap_drinks)
      this.view_recap_order = false;
  }

  async sendOrder(): Promise<void> {
    try {
      console.log(this.selectedTable);
      // già presente l'ordine, devo fare la put
      if (this.selectedTable.hasOwnProperty("id_order")) {
        const id_order = this.selectedTable.id_order;
        let WaiterOrdersServicePromise = await this.waiterOrdersService.sendPUTOrder(id_order, this.drinks_order, this.foods_order, this.tot_sub_drinks, this.tot_sub_foods);
        // ritorna l'observable...
        WaiterOrdersServicePromise.subscribe(
          (ResSub => {
            // DA MOSTRARE UN ALERT CON LA CONFERMA DI INVIO
            // ri azzero gli array degli ordini
            this.drinks_order = [];
            this.foods_order = [];
            this.view_recap_order = false;
            this.view_recap_drinks = false;
            this.view_recap_foods = false;
            this.view_menu = false;
            console.log("PUT ORDINE INVIATA", ResSub);
          }),
          (ErrSub => {
            // necessario il catch della promise non gestisce l'errore dell'observable
            // E' avvenuto un errore con il refresh dell'AccessToken: è necessario un nuovo login
            this.router.navigate(['/auth/login']);
            // da andare in pagina di login
            console.log("SEND ORDER err", ErrSub);
          })
        )
      }
      else {
        console.log("qui");
        const waiter = localStorage.getItem('UserName');
        let WaiterOrdersServicePromise = await this.waiterOrdersService.sendPOSTOrder(this.drinks_order, this.foods_order, this.tot_sub_drinks, this.tot_sub_foods, this.selectedTable.name_table, waiter);
        // ritorna l'observable...
        WaiterOrdersServicePromise.subscribe(
          (ResSub => {
            // DA MOSTRARE UN ALERT CON LA CONFERMA DI INVIO
            // ri azzero gli array degli ordini
            this.drinks_order = [];
            this.foods_order = [];
            this.view_recap_order = false;
            this.view_recap_drinks = false;
            this.view_recap_foods = false;
            this.view_menu = false;
            console.log("POST ORDINE INVIATA", ResSub);
            this.selectedTable.id_order = ResSub.id_order;
          }),
          (ErrSub => {
            // necessario il catch della promise non gestisce l'errore dell'observable
            // E' avvenuto un errore con il refresh dell'AccessToken: è necessario un nuovo login
            this.router.navigate(['/auth/login']);
            // da andare in pagina di login
            console.log("SEND ORDER err", ErrSub);
          })
        )
      }
    } catch (errorPromise) {
      this.router.navigate(['/auth/login']);
      // da andare in pagina di login, MA: sarebbe poi da fare un back a questa pagina quando si è fatto effettivamente il login
      console.log("sono qui");
      console.log("SEND ORDER err", errorPromise);
    }
  }

}
