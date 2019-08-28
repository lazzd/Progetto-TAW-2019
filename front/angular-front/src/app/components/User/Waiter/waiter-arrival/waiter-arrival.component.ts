import { Component, OnInit } from '@angular/core';

import { WaiterArrivalService } from '../../../../services/User/Waiter/waiter-arrival/waiter-arrival.service';
import { SocketService } from '../../../../services/socket/socket.service';

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
    private router: Router,
    private socketService: SocketService) { }

  ngOnInit() {
    this.initIoConnection();
    this.view_arrival_Suborders = false;
    this.allArrivalSuborders = [];
    this.getMyArrivalOrders();
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    // filtro da backend per nome
    this.socketService
      .arrivalSuborder()
      .subscribe(Order => {
        console.log("EMIT: ", Order);
        // in un put/post -> un elem si oggiona, trovato quelli possibile fermare l'iterazione
        for (let i = 0; i < Order.elements_order.length; ++i) {
          // trova l'indice associato se presente
          const isPresent = this.allArrivalSuborders.find((elem) => elem.id_suborder == Order.elements_order[i].id_suborder);
          if (isPresent) {
            isPresent.state = Order.elements_order[i].state;
            if (isPresent.state.drinks_served) {
              isPresent.drinks_order = null;
            }
            else if (!isPresent.state.drinks_served && Order.elements_order[i].state.drinks_complete) {
              isPresent.setDrinksOrder(Order.elements_order[i].drinks_order);
            }
            if (isPresent.state.foods_served) {
              isPresent.foods_order = null;
            }
            else if (!isPresent.state.foods_served && Order.elements_order[i].state.foods_complete)
              isPresent.setFoodsOrder(Order.elements_order[i].foods_order);
            if (!isPresent.drinks_order && !isPresent.foods_order) {
              const index = this.allArrivalSuborders.findIndex(elem => elem.id_suborder == Order.elements_order[i].id_suborder)
              this.allArrivalSuborders.splice(index, 1);
            }
          }
          // element not present in array WaitOrders
          else {
            // operazione con costo minore che chiamare un costruttore
            if ((!Order.elements_order[i].state.drinks_served && Order.elements_order[i].state.drinks_complete) || (!Order.elements_order[i].state.foods_served && Order.elements_order[i].state.foods_complete)) {
              const newWaitSuborder = new WaitSuborder(Order.table, Order.id_order, Order.elements_order[i].id_suborder, Order.waiter, Order.elements_order[i].state);
              if (!Order.elements_order[i].state.drinks_served && Order.elements_order[i].state.drinks_complete)
                newWaitSuborder.setDrinksOrder(Order.elements_order[i].drinks_order);
              if (!Order.elements_order[i].state.foods_served && Order.elements_order[i].state.foods_complete)
                newWaitSuborder.setFoodsOrder(Order.elements_order[i].foods_order);
              this.allArrivalSuborders.push(newWaitSuborder);
            }
          }
          if (this.allArrivalSuborders.length > 0) {
            this.view_arrival_Suborders = true;
            console.log(this.allArrivalSuborders);
          }
          else {
            this.view_arrival_Suborders = false;
          }
        }
      }
      );

    this.socketService
      .completeOrder()
      .subscribe(Order => {
        console.log("DELETE", Order);
        this.allArrivalSuborders = this.allArrivalSuborders.filter(elem => elem.id_order != Order.id_order);
        if (!this.allArrivalSuborders.length)
          this.view_arrival_Suborders = false;
      })

  }

  async getMyArrivalOrders(): Promise<void> {
    try {
      let WaiterArrivalServicePromise = await this.waiterArrivalService.getMyArrivalOrders();
      // ritorna l'observable
      WaiterArrivalServicePromise.subscribe(
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
                if ((!Suborder.state.drinks_served && Suborder.state.drinks_complete) || (!Suborder.state.foods_served && Suborder.state.foods_complete)) {
                  const newWaitSuborder = new WaitSuborder(Order.table, Order.id_order, Suborder.id_suborder, Order.waiter, Suborder.state);
                  if (!Suborder.state.drinks_served && Suborder.state.drinks_complete)
                    newWaitSuborder.setDrinksOrder(Suborder.drinks_order);
                  if (!Suborder.state.foods_served && Suborder.state.foods_complete)
                    newWaitSuborder.setFoodsOrder(Suborder.foods_order);
                  this.allArrivalSuborders.push(newWaitSuborder);
                }
              }
            }
            if (this.allArrivalSuborders.length > 0) {
              this.view_arrival_Suborders = true;
              console.log(this.allArrivalSuborders);
            }
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
      console.log("SEND ORDER err", errorPromise);
    }
  }

  async completeArrivalSuborder(id_order: number, id_suborder: number, type: string) {
    try {
      let WaiterArrivalServicePromise = await this.waiterArrivalService.completeArrivalSuborder(id_order, id_suborder, type);
      // ritorna l'observable...
      WaiterArrivalServicePromise.subscribe(
        (ResSub => {
          // Operazioni effettuate nel socket
          console.log("OK");
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
      console.log("SEND ORDER err", errorPromise);
    }
  }

}
