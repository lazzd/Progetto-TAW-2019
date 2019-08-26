import { Component, OnInit } from '@angular/core';

import { CashierReceiptsService } from '../../../../services/User/Cashier/cashier-receipts/cashier-receipts.service';

import { SocketService } from '../../../../services/socket/socket.service';

import { Router } from "@angular/router";
import { ResOrder } from 'src/app/classes/res_order';


@Component({
  selector: 'app-cashier-receipts',
  templateUrl: './cashier-receipts.component.html',
  styleUrls: ['./cashier-receipts.component.scss']
})
export class CashierReceiptsComponent implements OnInit {

  tot_today: number;
  todayCompleteOrder: ResOrder[];

  constructor(
    private cashierReceiptsService: CashierReceiptsService,
    private router: Router,
    private socketService: SocketService) { }

  ngOnInit() {
    this.initIoConnection();
    this.tot_today = 0;
    this.todayCompleteOrder = [];
    this.getTodayCompleteOrders();
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService
      .completeOrder()
      .subscribe(Order => {
        this.tot_today += Order.tot;
        this.todayCompleteOrder.push(new ResOrder(Order));
      })

  }

  async getTodayCompleteOrders(): Promise<void> {
    try {
      const today = new Date();
      const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
      console.log("Date", date);
      let CashierReceiptsServicePromise = await this.cashierReceiptsService.getCompleteOrdersByDate(date);
      // ritorna l'observable...
      CashierReceiptsServicePromise.subscribe(
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
              this.todayCompleteOrder.push(new ResOrder(element));
              this.tot_today += element.tot;
            });
            /*
            if (this.allNotCompleteOrder.length > 0)
              this.view_orders = true;
            //this.view_tables = true;
            */
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
