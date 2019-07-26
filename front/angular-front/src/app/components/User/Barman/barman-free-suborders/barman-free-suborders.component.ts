import { Component, OnInit } from '@angular/core';

import { BarmanFreeSubordersService } from '../../../../services/User/Barman/barman-free-suborders/barman-free-suborders.service';

import { Router } from "@angular/router";
import { WaitSuborder } from 'src/app/classes/wait_suborder';
import { ElementOrder } from 'src/app/classes/element_order';

@Component({
  selector: 'app-barman-free-suborders',
  templateUrl: './barman-free-suborders.component.html',
  styleUrls: ['./barman-free-suborders.component.scss']
})
export class BarmanFreeSubordersComponent implements OnInit {

  view_Suborders: Boolean;
  firstSuborders: WaitSuborder;
  allSuborders: WaitSuborder[];

  constructor(
    private barmanFreeSubordersService: BarmanFreeSubordersService,
    private router: Router) { }

  ngOnInit() {
    this.allSuborders = [];
    this.view_Suborders = false;
    this.getOrdersByBarman();
  }

  async getOrdersByBarman(): Promise<void> {
    try {
      let BarmanFreeSubordersServicePromise = await this.barmanFreeSubordersService.getOrdersByBarman();
      // ritorna l'observable...
      BarmanFreeSubordersServicePromise.subscribe(
        (ResSub => {
          // L'AccessToken è valido: o perchè NON era scaduto oppure perchè il refresh è avvenuto in maniara corretta
          if (ResSub.length == 0) {
            //this.view_tables = false;
          }
          else {
            console.log(ResSub);
            for (let Order of ResSub) {
              for (let Suborder of Order.elements_order) {
                this.allSuborders.push(new WaitSuborder(Order.table, Order.id_order, Suborder.id_suborder, Order.waiter, Suborder.drinks_order))
              }
            }
            this.allSuborders.sort((a, b) => a.id_suborder - b.id_suborder);
            this.firstSuborders = this.allSuborders.shift();
            this.view_Suborders = true;
            console.log(this.allSuborders);
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
