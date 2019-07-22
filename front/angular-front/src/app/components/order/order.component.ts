import { Component, OnInit } from '@angular/core';

import { OrderService } from '../../services/order/order.service';

// for routing
import { Router } from "@angular/router"

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  constructor(
    private orderService: OrderService,
    private router: Router) { }

  ngOnInit() {
  }

  /*
  Cose da fare:
    classe per ritorno JSON auth;
    capire il tiop di ritorno per ts e immettere i console log con i veri errori
    fare i redirect al login 
  */

  // sendOrderComponent V.2
  /*sendOrder(): void {
    this.orderService.sendOrder()
      .then(
        (resolveObs => {
          resolveObs.subscribe(
            (res => {
              // L'AccessToken è valido: o perchè NON era scaduto oppure perchè il refresh è avvenuto in maniara corretta
              console.log("SEND ORDER RES", res);
            }),
            (err => {
              // E' avvenuto un errore con il refresh dell'AccessToken: è necessario un nuovo login
              this.router.navigate(['/auth/login']);
              // da andare in pagina di login
              console.log("SEND ORDER err", err);
            })
          )
        }),
        // quello che arriva è comunuqe un Observable, ma solamente di errore
        (errPromise => {
          // E' avvenuto un errore con la promise: è necessario un nuovo login
          this.router.navigate(['/auth/login']);
          console.log("Error Promise");
        })
      );
  }*/

  async sendOrder(): Promise<void> {
    try {
      let OrderComponentPromise = await this.orderService.sendOrder();
      // ritorna l'observable...
      OrderComponentPromise.subscribe(
        (res => {
          // L'AccessToken è valido: o perchè NON era scaduto oppure perchè il refresh è avvenuto in maniara corretta
          console.log("SEND ORDER RES", res);
        }),
        (err => {
          // necessario il catch della promise non gestisce l'errore dell'observable
          // E' avvenuto un errore con il refresh dell'AccessToken: è necessario un nuovo login
          this.router.navigate(['/auth/login']);
          // da andare in pagina di login
          console.log("SEND ORDER err", err);
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
