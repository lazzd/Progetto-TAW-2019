import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

// for routing
import { Router } from "@angular/router"

// logout service
import { LogoutService } from '../../../../services/logout/logout.service';

import { SocketService } from '../../../../services/socket/socket.service';
import { ResOrder } from 'src/app/classes/res_order';

@Component({
  selector: 'app-sidenav-cashier',
  templateUrl: './sidenav-cashier.component.html',
  styleUrls: ['./sidenav-cashier.component.scss']
})
export class SidenavCashierComponent implements OnDestroy {

  mobileQuery: MediaQueryList;

  allServedNotCompleteOrder: ResOrder[];

  place: string;

  ntf_bills: Boolean;

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
    this.allServedNotCompleteOrder = [];
    this.place = "main";
    this.ntf_bills = false;
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService
      .arrivalSuborder()
      .subscribe(Order => {
        console.log("ARRIVAL", Order);
        const indexPresent = this.allServedNotCompleteOrder.findIndex(elem => elem.id_order == Order.id_order);
        if (Order.state_order.all_served) {
          if (indexPresent != -1)
            this.allServedNotCompleteOrder[indexPresent] = new ResOrder(Order);
          else {
            this.allServedNotCompleteOrder.push(new ResOrder(Order));
          }
        }
        else {
          if (indexPresent != -1)
            this.allServedNotCompleteOrder.splice(indexPresent, 1);
        }
        if (this.allServedNotCompleteOrder.length > 0) {
          if (this.place != 'bills' && !this.ntf_bills)
            this.ntf_bills = true;
        }
        else {
          if (this.ntf_bills)
            this.ntf_bills = false;
        }
      });

    this.socketService
      .newSuborder()
      .subscribe(Order => {
        console.log("NEW", Order);
        const indexPresent = this.allServedNotCompleteOrder.findIndex(elem => elem.id_order == Order.id_order);
        if (Order.state_order.all_served) {
          if (indexPresent != -1)
            this.allServedNotCompleteOrder[indexPresent] = new ResOrder(Order);
          else {
            this.allServedNotCompleteOrder.push(new ResOrder(Order));
          }
        }
        else {
          if (indexPresent != -1)
            this.allServedNotCompleteOrder.splice(indexPresent, 1);
        }
        if (this.allServedNotCompleteOrder.length > 0) {
          if (this.place != 'bills' && !this.ntf_bills)
            this.ntf_bills = true;
        }
        else {
          if (this.ntf_bills)
            this.ntf_bills = false;
        }
      });

    this.socketService
      .completeOrder()
      .subscribe(Order => {
        console.log("DELETE", Order);
        const indexPresent = this.allServedNotCompleteOrder.findIndex(elem => elem.id_order == Order.id_order);
        if (indexPresent != -1)
          this.allServedNotCompleteOrder.splice(indexPresent, 1);
        if (this.allServedNotCompleteOrder.length > 0) {
          if (this.place != 'bills' && !this.ntf_bills)
            this.ntf_bills = true;
        }
        else {
          if (this.ntf_bills)
            this.ntf_bills = false;
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
    this.place = place;
    if (place == "bills") {
      this.ntf_bills = false;
    }
  }

}