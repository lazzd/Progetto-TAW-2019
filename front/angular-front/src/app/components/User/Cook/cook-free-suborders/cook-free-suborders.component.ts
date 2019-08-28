import { Component, OnInit } from '@angular/core';

import { CookFreeSubordersService } from '../../../../services/User/Cook/cook-free-suborders/cook-free-suborders.service';

import { Router } from "@angular/router";
import { WaitSuborder } from 'src/app/classes/wait_suborder';
import { ElementOrder } from 'src/app/classes/element_order';

import { SocketService } from '../../../../services/socket/socket.service';
import { ElementMenu } from 'src/app/classes/element_menu';

@Component({
  selector: 'app-cook-free-suborders',
  templateUrl: './cook-free-suborders.component.html',
  styleUrls: ['./cook-free-suborders.component.scss']
})
export class CookFreeSubordersComponent implements OnInit {

  view_Suborders: Boolean;
  firstSuborders: WaitSuborder;
  allSuborders: WaitSuborder[];

  constructor(
    private cookFreeSubordersService: CookFreeSubordersService,
    private router: Router,
    private socketService: SocketService) { }

  ngOnInit() {
    this.initIoConnection();
    this.allSuborders = [];
    this.view_Suborders = false;
    this.getOrdersByCook();
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService
      .takeSuborder()
      .subscribe(data => {
        console.log('Incoming msg', data);
        if (data == "A COOK take the first suborder") {
          if (this.allSuborders.length > 0)
            this.firstSuborders = this.allSuborders.shift();
          else {
            this.view_Suborders = false;
            this.firstSuborders = null;
          }
        }
      });

    this.socketService
      .newSuborder()
      .subscribe(Order => {
        console.log("EMIT: ", Order);
        // il suborder maggiore è sempre pushato nell'array (pop - last position)
        const ElementOrder: ElementOrder = Order.elements_order.pop();
        const suborder: ElementMenu[] = ElementOrder.foods_order;
        if (suborder.length > 0) {
          this.allSuborders.push(new WaitSuborder(Order.table, Order.id_order, ElementOrder.id_suborder, Order.waiter, ElementOrder.state, suborder));
          if (!this.firstSuborders) {
            this.firstSuborders = this.allSuborders.shift();
            this.view_Suborders = true;
          }
        }
      })

  }

  async getOrdersByCook(): Promise<void> {
    try {
      let CookFreeSubordersServicePromise = await this.cookFreeSubordersService.getOrdersByCook();
      // ritorna l'observable...
      CookFreeSubordersServicePromise.subscribe(
        (ResSub => {
          // L'AccessToken è valido: o perchè NON era scaduto oppure perchè il refresh è avvenuto in maniara corretta
          if (ResSub.length == 0) {
            this.view_Suborders = false;
          }
          else {
            console.log(ResSub);
            for (let Order of ResSub) {
              for (let Suborder of Order.elements_order) {
                if (Suborder.foods_order.length > 0)
                  this.allSuborders.push(new WaitSuborder(Order.table, Order.id_order, Suborder.id_suborder, Order.waiter, Suborder.state, Suborder.foods_order))
              }
            }
            if (this.allSuborders.length > 0) {
              this.allSuborders.sort((a, b) => a.id_suborder - b.id_suborder);
              this.firstSuborders = this.allSuborders.shift();
              this.view_Suborders = true;
              console.log(this.allSuborders);
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

  async takeSuborder() {
    try {
      let CookFreeSubordersServicePromise = await this.cookFreeSubordersService.takeSuborder(this.firstSuborders.id_order, this.firstSuborders.id_suborder, localStorage.getItem('UserName'));
      // ritorna l'observable...
      CookFreeSubordersServicePromise.subscribe(
        (ResSub => {
          // L'AccessToken è valido: o perchè NON era scaduto oppure perchè il refresh è avvenuto in maniara corretta
          if (ResSub.length == 0) {
            //this.view_tables = false;
          }
          else {
            console.log(ResSub);
            // TOLTO PERCHE' MESSO NESSLA IMPLEMENTAZIONE DEI WEB SOCKET
            /*if (this.allSuborders.length > 0)
              this.firstSuborders = this.allSuborders.shift();
            else {
              this.view_Suborders = false;
              this.firstSuborders = null;
            }*/
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
