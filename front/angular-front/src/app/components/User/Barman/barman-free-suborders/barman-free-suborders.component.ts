import { Component, OnInit } from '@angular/core';

import { BarmanFreeSubordersService } from '../../../../services/User/Barman/barman-free-suborders/barman-free-suborders.service';

import { Router } from "@angular/router";
import { WaitSuborder } from 'src/app/classes/wait_suborder';
import { ElementOrder } from 'src/app/classes/element_order';

import { SocketService } from '../../../../services/socket/socket.service';
import { ElementMenu } from 'src/app/classes/element_menu';

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
    private router: Router,
    private socketService: SocketService) { }

  ngOnInit() {
    this.initIoConnection();
    this.allSuborders = [];
    this.view_Suborders = false;
    this.getOrdersByBarman();
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService
      .takeSuborder()
      .subscribe(data => {
        console.log('Incoming msg', data);
        if (data == "A BARMAN take the first suborder") {
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
        const suborder: ElementMenu[] = ElementOrder.drinks_order;
        if (suborder.length > 0) {
          this.allSuborders.push(new WaitSuborder(Order.table, Order.id_order, ElementOrder.id_suborder, Order.waiter, ElementOrder.state, suborder));
          if (!this.firstSuborders) {
            this.firstSuborders = this.allSuborders.shift();
            this.view_Suborders = true;
          }
        }
      })

    this.socketService
      .completeOrder()
      .subscribe(Order => {
        console.log("DELETE", Order);
        this.allSuborders = this.allSuborders.filter(elem => elem.id_order != Order.id_order);
        if (this.firstSuborders.id_order == Order.id_order)
          if (this.allSuborders.length)
            this.firstSuborders = this.allSuborders.shift();
          else
            this.firstSuborders = null;
        if (!this.firstSuborders)
          this.view_Suborders = false;
      })

  }

  async getOrdersByBarman(): Promise<void> {
    try {
      let BarmanFreeSubordersServicePromise = await this.barmanFreeSubordersService.getOrdersByBarman();
      // ritorna l'observable...
      BarmanFreeSubordersServicePromise.subscribe(
        (ResSub => {
          // L'AccessToken è valido: o perchè NON era scaduto oppure perchè il refresh è avvenuto in maniara corretta
          if (ResSub.length == 0) {
            this.view_Suborders = false;
          }
          else {
            console.log(ResSub);
            for (let Order of ResSub) {
              for (let Suborder of Order.elements_order) {
                if (Suborder.drinks_order.length > 0)
                  this.allSuborders.push(new WaitSuborder(Order.table, Order.id_order, Suborder.id_suborder, Order.waiter, Suborder.state, Suborder.drinks_order))
              }
            }
            if (this.allSuborders.length > 0) {
              this.allSuborders.sort((a, b) => a.id_suborder - b.id_suborder);
              this.firstSuborders = this.allSuborders.shift();
              this.firstSuborders.suborder.sort((a, b) => - a.time + b.time);
              for (let singleSuborder of this.allSuborders) {
                singleSuborder.suborder.sort((a, b) => - a.time + b.time);
              }
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
      let BarmanFreeSubordersServicePromise = await this.barmanFreeSubordersService.takeSuborder(this.firstSuborders.id_order, this.firstSuborders.id_suborder, localStorage.getItem('UserName'));
      // ritorna l'observable...
      BarmanFreeSubordersServicePromise.subscribe(
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
