import { Component, OnInit } from '@angular/core';

import { CookMySubordersService } from '../../../../services/User/Cook/cook-my-suborders/cook-my-suborders.service';

import { Router } from "@angular/router";
import { WaitSuborder } from 'src/app/classes/wait_suborder';

import { SocketService } from '../../../../services/socket/socket.service';

@Component({
  selector: 'app-cook-my-suborders',
  templateUrl: './cook-my-suborders.component.html',
  styleUrls: ['./cook-my-suborders.component.scss']
})
export class CookMySubordersComponent implements OnInit {

  view_my_Suborders: Boolean;
  firstMySuborders: WaitSuborder;
  allMySuborders: WaitSuborder[];

  constructor(
    private cookMySubordersService: CookMySubordersService,
    private router: Router,
    private socketService: SocketService) { }

  ngOnInit() {
    //this.initIoConnection();
    this.allMySuborders = [];
    this.view_my_Suborders = false;
    this.getMyOrdersByCook();
  }

  async getMyOrdersByCook(): Promise<void> {
    try {
      let CookMySubordersServicePromise = await this.cookMySubordersService.getMyOrdersByCook();
      // ritorna l'observable...
      CookMySubordersServicePromise.subscribe(
        (ResSub => {
          // L'AccessToken è valido: o perchè NON era scaduto oppure perchè il refresh è avvenuto in maniara corretta
          if (ResSub.length == 0) {
            this.view_my_Suborders = false;
          }
          else {
            console.log(ResSub);
            for (let Order of ResSub) {
              for (let Suborder of Order.elements_order) {
                if (Suborder.foods_order.length > 0)
                  this.allMySuborders.push(new WaitSuborder(Order.table, Order.id_order, Suborder.id_suborder, Order.waiter, Suborder.foods_order))
              }
            }
            if (this.allMySuborders.length > 0) {
              this.allMySuborders.sort((a, b) => a.id_suborder - b.id_suborder);
              for (let Suborder of this.allMySuborders) {
                Suborder.suborder.sort((a, b) => -(a.time - b.time));
              }
              this.firstMySuborders = this.allMySuborders.shift();
              this.view_my_Suborders = true;
              console.log(this.allMySuborders);
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

  completeElementMySuborder(){
    this.firstMySuborders.suborder.shift();
  }

  async completeMySuborder() {
    try {
      let CookMySubordersServicePromise = await this.cookMySubordersService.completeMySuborder(this.firstMySuborders.id_order, this.firstMySuborders.id_suborder);
      // ritorna l'observable...
      CookMySubordersServicePromise.subscribe(
        (ResSub => {
          // L'AccessToken è valido: o perchè NON era scaduto oppure perchè il refresh è avvenuto in maniara corretta
          if (ResSub.length == 0) {
            //this.view_tables = false;
          }
          else {
            console.log(ResSub);
            if (this.allMySuborders.length > 0)
              this.firstMySuborders = this.allMySuborders.shift();
            else {
              this.view_my_Suborders = false;
              this.firstMySuborders = null;
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

}
