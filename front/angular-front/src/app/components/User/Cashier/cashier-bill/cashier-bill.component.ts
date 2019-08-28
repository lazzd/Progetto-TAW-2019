import { Component, OnInit } from '@angular/core';
import { ResOrder } from 'src/app/classes/res_order';

import { CashierBillService } from '../../../../services/User/Cashier/cashier-bill/cashier-bill.service';
import { SocketService } from '../../../../services/socket/socket.service';

import { Router } from "@angular/router";

@Component({
  selector: 'app-cashier-bill',
  templateUrl: './cashier-bill.component.html',
  styleUrls: ['./cashier-bill.component.scss']
})
export class CashierBillComponent implements OnInit {

  view_bills: Boolean;
  allServedNotCompleteOrder: ResOrder[];

  constructor(
    private cashierBillService: CashierBillService,
    private router: Router,
    private socketService: SocketService) { }

  ngOnInit() {
    this.initIoConnection();
    this.allServedNotCompleteOrder = [];
    this.view_bills = false;
    this.getAllNotCompleteOrder();
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService
      .arrivalSuborder()
      .subscribe(Order => {
        console.log("ARRIVAL", Order);
        const indexPresent = this.allServedNotCompleteOrder.findIndex(elem => elem.id_order == Order.id_order);
        if (indexPresent != -1)
          this.allServedNotCompleteOrder[indexPresent] = new ResOrder(Order);
        else {
          this.allServedNotCompleteOrder.push(new ResOrder(Order));
          if (this.allServedNotCompleteOrder.length > 0)
            this.view_bills = true;
        }
      });

    this.socketService
      .newSuborder()
      .subscribe(Order => {
        console.log("NEW", Order);
        const indexPresent = this.allServedNotCompleteOrder.findIndex(elem => elem.id_order == Order.id_order);
        if (indexPresent != -1)
          this.allServedNotCompleteOrder[indexPresent] = new ResOrder(Order);
        else {
          this.allServedNotCompleteOrder.push(new ResOrder(Order));
          if (this.allServedNotCompleteOrder.length > 0)
            this.view_bills = true;
        }
      });

    this.socketService
      .completeOrder()
      .subscribe(Order => {
        console.log("DELETE", Order);
        const indexPresent = this.allServedNotCompleteOrder.findIndex(elem => elem.id_order == Order.id_order);
        if (indexPresent != -1)
          this.allServedNotCompleteOrder.splice(indexPresent, 1);
        if (!this.allServedNotCompleteOrder.length)
          this.view_bills = false;
      })

  }

  async getAllNotCompleteOrder(): Promise<void> {
    try {
      let CashierBillServicePromise = await this.cashierBillService.getAllNotCompleteOrder();
      // ritorna l'observable...
      CashierBillServicePromise.subscribe(
        (ResSub => {
          // L'AccessToken è valido: o perchè NON era scaduto oppure perchè il refresh è avvenuto in maniara corretta
          if (ResSub.length == 0) {
            console.log("ResSub Length == 0");
          }
          else {
            console.log(ResSub);
            ResSub.forEach(element => {
              this.allServedNotCompleteOrder.push(new ResOrder(element));
            });
            console.log(this.allServedNotCompleteOrder)
            if (this.allServedNotCompleteOrder.length > 0)
              this.view_bills = true;
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

  async completeOrder(id_order: number, name_table: string) {
    try {
      let CashierBillServicePromise1 = await this.cashierBillService.completeOrder(id_order);
      CashierBillServicePromise1.subscribe((async ResSub => {
        let CashierBillServicePromise2 = await this.cashierBillService.table(name_table);
        // ritorna l'observable...
        CashierBillServicePromise2.subscribe(
          (ResSub => {
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
