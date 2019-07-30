import { Component, OnInit } from '@angular/core';

import { CashierOrdersService } from '../../../../services/User/Cashier/cashier-orders/cashier-orders.service';

import { SocketService } from '../../../../services/socket/socket.service';

import { Router } from "@angular/router";
import { ResOrder } from 'src/app/classes/res_order';

@Component({
  selector: 'app-cashier-orders',
  templateUrl: './cashier-orders.component.html',
  styleUrls: ['./cashier-orders.component.scss']
})
export class CashierOrdersComponent implements OnInit {

  view_orders: Boolean;
  allNotCompleteOrder: ResOrder[];

  constructor(
    private cashierOrdersService: CashierOrdersService,
    private router: Router,
    private socketService: SocketService) { }

  ngOnInit() {
    this.initIoConnection();
    this.allNotCompleteOrder = [];
    this.view_orders = false;
    this.getAllNotCompleteOrder();
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService
      .arrivalSuborder()
      .subscribe(Order => {
        console.log("ARRIVAL", Order);
        const indexPresent = this.allNotCompleteOrder.findIndex(elem => elem.id_order == Order.id_order);
        if (indexPresent != -1)
          this.allNotCompleteOrder[indexPresent] = new ResOrder(Order);
        else {
          console.log("IMPOSSIBLE");
          this.allNotCompleteOrder.push(new ResOrder(Order));
          if (this.allNotCompleteOrder.length > 0)
            this.view_orders = true;
          //this.view_tables = true;
        }
      });

    this.socketService
      .newSuborder()
      .subscribe(Order => {
        console.log("NEW", Order);
        const indexPresent = this.allNotCompleteOrder.findIndex(elem => elem.id_order == Order.id_order);
        if (indexPresent != -1)
          this.allNotCompleteOrder[indexPresent] = new ResOrder(Order);
        else {
          console.log("sssssss");
          this.allNotCompleteOrder.push(new ResOrder(Order));
          if (this.allNotCompleteOrder.length > 0)
            this.view_orders = true;
          //this.view_tables = true;
        }
      });

    this.socketService
      .completeOrder()
      .subscribe(Order => {
        console.log("DELETE", Order);
        const indexPresent = this.allNotCompleteOrder.findIndex(elem => elem.id_order == Order.id_order);
        if (indexPresent != -1)
          this.allNotCompleteOrder.splice(indexPresent, 1);
      })

  }

  async getAllNotCompleteOrder(): Promise<void> {
    try {
      let CashierBillServicePromise = await this.cashierOrdersService.getAllNotCompleteOrder();
      // ritorna l'observable...
      CashierBillServicePromise.subscribe(
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
              this.allNotCompleteOrder.push(new ResOrder(element));
            });
            if (this.allNotCompleteOrder.length > 0)
              this.view_orders = true;
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

}
