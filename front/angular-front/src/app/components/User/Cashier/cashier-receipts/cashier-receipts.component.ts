import { Component, OnInit } from '@angular/core';

import { CashierReceiptsService } from '../../../../services/User/Cashier/cashier-receipts/cashier-receipts.service';

import { SocketService } from '../../../../services/socket/socket.service';

import { Router } from "@angular/router";
import { ResOrder } from 'src/app/classes/res_order';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-cashier-receipts',
  templateUrl: './cashier-receipts.component.html',
  styleUrls: ['./cashier-receipts.component.scss']
})
export class CashierReceiptsComponent implements OnInit {

  form_date: FormGroup;

  tot_today: number;
  todayCompleteOrder: ResOrder[];

  view_by_date: Boolean;
  select_date: Date;
  tot_by_date: number;
  byDateCompleteOrder: ResOrder[];

  constructor(
    private cashierReceiptsService: CashierReceiptsService,
    private router: Router,
    private socketService: SocketService) { }

  ngOnInit() {
    this.form_date = new FormGroup({
      input_date: new FormControl()
    });
    this.initIoConnection();
    this.view_by_date = false;
    this.select_date = null;
    this.tot_today = 0;
    this.tot_by_date = 0;
    this.byDateCompleteOrder = [];
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
      // ritorna l'observable
      CashierReceiptsServicePromise.subscribe(
        (ResSub => {
          // L'AccessToken è valido: o perchè NON era scaduto oppure perchè il refresh è avvenuto in maniara corretta
          if (ResSub.length == 0) {
            console.log("ResSub Length == 0");
          }
          else {
            console.log(ResSub);
            ResSub.forEach(element => {
              this.todayCompleteOrder.push(new ResOrder(element));
              this.tot_today += element.tot;
            });
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

  async hideDate(): Promise<void> {
    this.view_by_date = false;
  }

  async getCompleteOrdersByDate(): Promise<void> {
    try {
      if (this.form_date.value.input_date) {
        this.select_date = this.form_date.value.input_date;
        const date = this.select_date.getFullYear() + "-" + (this.select_date.getMonth() + 1) + "-" + this.select_date.getDate();
        this.byDateCompleteOrder = [];
        this.tot_by_date = 0;
        console.log(date);
        let CashierReceiptsServicePromise = await this.cashierReceiptsService.getCompleteOrdersByDate(date);
        // ritorna l'observable
        CashierReceiptsServicePromise.subscribe(
          (ResSub => {
            // L'AccessToken è valido: o perchè NON era scaduto oppure perchè il refresh è avvenuto in maniara corretta
            if (ResSub.length == 0) {
              console.log("ResSub Length == 0");
            }
            else {
              console.log(ResSub);
              ResSub.forEach(element => {
                this.byDateCompleteOrder.push(new ResOrder(element));
                this.tot_by_date += element.tot;
              });
            }
            this.view_by_date = true;
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
      console.log("SEND ORDER err", errorPromise);
    }
  }

}
