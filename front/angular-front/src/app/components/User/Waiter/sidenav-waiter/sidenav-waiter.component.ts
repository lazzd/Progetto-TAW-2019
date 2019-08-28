import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

// for routing
import { Router } from "@angular/router"

// logout service
import { LogoutService } from '../../../../services/logout/logout.service';

import { SocketService } from '../../../../services/socket/socket.service';
import { WaitSuborder } from 'src/app/classes/wait_suborder';

@Component({
  selector: 'app-sidenav-waiter',
  templateUrl: './sidenav-waiter.component.html',
  styleUrls: ['./sidenav-waiter.component.scss']
})
export class SidenavWaiterComponent implements OnDestroy {

  mobileQuery: MediaQueryList;

  set: boolean;

  place: string;

  allArrivalSuborders: WaitSuborder[];

  ntf_arrival: Boolean;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private logoutService: LogoutService,
    private router: Router,
    private socketService: SocketService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.initIoConnection();
    this.allArrivalSuborders = [];
    this.place = "main";
    this.ntf_arrival = false;
    this.set = false;
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService
    .arrivalSuborder()
    .subscribe(Order => {
      console.log("EMIT: ", Order);
      let flag = false;
      // in un put/post -> un elem si oggiona, trovato quelli possibile fermare l'iterazione
      for (let i = 0; i < Order.elements_order.length; ++i) {
        // trova l'indice associato se presente
        const isPresent = this.allArrivalSuborders.find((elem) => elem.id_suborder == Order.elements_order[i].id_suborder);
        if (isPresent) {
          isPresent.state = Order.elements_order[i].state;
          console.log("QUI 1");
          if (isPresent.state.drinks_served) {
            isPresent.drinks_order = null;
          }
          else if (!isPresent.state.drinks_served && Order.elements_order[i].state.drinks_complete) {
            isPresent.setDrinksOrder(Order.elements_order[i].drinks_order);
            //flag = true;
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
          //flag = true;
        }
        // element not present in array WaitOrders
        else {
          console.log("QUI 2");
          //CHIAMARE UN COSTRUTTORE COSTA
          if ((!Order.elements_order[i].state.drinks_served && Order.elements_order[i].state.drinks_complete) || (!Order.elements_order[i].state.foods_served && Order.elements_order[i].state.foods_complete)) {
            const newWaitSuborder = new WaitSuborder(Order.table, Order.id_order, Order.elements_order[i].id_suborder, Order.waiter, Order.elements_order[i].state);
            if (!Order.elements_order[i].state.drinks_served && Order.elements_order[i].state.drinks_complete)
              newWaitSuborder.setDrinksOrder(Order.elements_order[i].drinks_order);
            if (!Order.elements_order[i].state.foods_served && Order.elements_order[i].state.foods_complete)
              newWaitSuborder.setFoodsOrder(Order.elements_order[i].foods_order);
            //if (newWaitSuborder.drinks_order || newWaitSuborder.foods_order)
            this.allArrivalSuborders.push(newWaitSuborder);
          }
        }
        if (this.allArrivalSuborders.length > 0) {
          if (this.place != 'arrival' && !this.ntf_arrival)
            this.ntf_arrival = true;
        }
        else {
          if (this.ntf_arrival)
            this.ntf_arrival = false;
        }
      }
    }
    );

  this.socketService
    .completeOrder()
    .subscribe(Order => {
      console.log("DELETE", Order);
      this.allArrivalSuborders = this.allArrivalSuborders.filter(elem => elem.id_order!=Order.id_order);
      if (this.allArrivalSuborders.length > 0) {
        if (this.place != 'arrival' && !this.ntf_arrival)
          this.ntf_arrival = true;
      }
      else {
        if (this.ntf_arrival)
          this.ntf_arrival = false;
      }
    })
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout() {
    this.logoutService.logout();
    this.router.navigate(['/auth']);
  }

  setOff(place: string): void {
    this.set = true;
    this.place = place;
    console.log(this.set);
    if (place == "arrival") {
      this.ntf_arrival = false;
    }
  }

}
