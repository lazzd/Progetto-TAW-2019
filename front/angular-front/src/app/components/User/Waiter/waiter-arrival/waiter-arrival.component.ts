import { Component, OnInit } from '@angular/core';

import { WaiterArrivalService } from '../../../../services/User/Waiter/waiter-arrival/waiter-arrival.service';

import { Router } from "@angular/router";
import { WaitSuborder } from 'src/app/classes/wait_suborder';

@Component({
  selector: 'app-waiter-arrival',
  templateUrl: './waiter-arrival.component.html',
  styleUrls: ['./waiter-arrival.component.scss']
})
export class WaiterArrivalComponent implements OnInit {

  view_arrival_Suborders: Boolean;
  allArrivalSuborders: WaitSuborder[];

  constructor(
    private waiterArrivalService: WaiterArrivalService,
    private router: Router) { }

  ngOnInit() {
    this.view_arrival_Suborders = false;
    this.allArrivalSuborders = [];
    this.getMyArrivalOrders();
  }

  async getMyArrivalOrders(): Promise<void> {
    try {
      let WaiterArrivalServicPromise = await this.waiterArrivalService.getMyArrivalOrders();
      // ritorna l'observable...
      WaiterArrivalServicPromise.subscribe(
        (ResSub => {
          // L'AccessToken è valido: o perchè NON era scaduto oppure perchè il refresh è avvenuto in maniara corretta
          if (ResSub.length == 0) {
            this.view_arrival_Suborders = false;
          }
          else {
            console.log(ResSub);
            // Suddivisione per FOODS e DRINKS
            for (let Order of ResSub) {
              for (let Suborder of Order.elements_order) {
                const newWaitSuborder = new WaitSuborder(Order.table, Order.id_order, Suborder.id_suborder, Order.waiter);
                if (Suborder.drinks_order.length > 0)
                  newWaitSuborder.setDrinksOrder(Suborder.drinks_order);
                if (Suborder.foods_order.length > 0)
                  newWaitSuborder.setFoodsOrder(Suborder.foods_order);
                this.allArrivalSuborders.push(newWaitSuborder);
              }
            }
            if (this.allArrivalSuborders.length > 0) {
              this.allArrivalSuborders.sort((a, b) => a.id_suborder - b.id_suborder);
              this.view_arrival_Suborders = true;
              console.log(this.allArrivalSuborders);
            }
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

  completeArrivalSuborder() { }

}
