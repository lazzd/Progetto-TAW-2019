import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

// for routing
import { Router } from "@angular/router"

// logout service
import { LogoutService } from '../../../../services/logout/logout.service';

import { SocketService } from '../../../../services/socket/socket.service';

import { ElementOrder } from 'src/app/classes/element_order';
import { ElementMenu } from 'src/app/classes/element_menu';
import { WaitSuborder } from 'src/app/classes/wait_suborder';

@Component({
  selector: 'app-sidenav-cook',
  templateUrl: './sidenav-cook.component.html',
  styleUrls: ['./sidenav-cook.component.scss']
})
export class SidenavCookComponent implements OnDestroy {

  mobileQuery: MediaQueryList;

  place: string;

  suborders: WaitSuborder[];

  ntf_free: Boolean;

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
    this.suborders = [];
    this.place = "main";
    this.ntf_free = false;
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService
    .takeSuborder()
    .subscribe(data => {
      console.log('Incoming msg', data);
      if (this.suborders.length > 0)
        this.suborders.shift();
      else {
        if (this.ntf_free)
          this.ntf_free = false;
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
        this.suborders.push(new WaitSuborder(Order.table, Order.id_order, ElementOrder.id_suborder, Order.waiter, ElementOrder.state, suborder));
        if (this.place != 'free' && !this.ntf_free)
          this.ntf_free = true;
      }
    })

  this.socketService
    .completeOrder()
    .subscribe(Order => {
      console.log("DELETE", Order);
      this.suborders = this.suborders.filter(elem => elem.id_order != Order.id_order);
      if (this.suborders.length > 0) {
        if (this.place != 'free' && !this.ntf_free)
          this.ntf_free = true;
      }
      else {
        if (this.ntf_free)
          this.ntf_free = false;
      }
    })
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout() {
    console.log("GGGGGGGGGGGGGGGGG")
    this.logoutService.logout()
      .subscribe(
        (res: any) => {
          console.log("LOGOUT SUCCESS", res);
          this.router.navigate(['/auth']);
        },
        (err: any) => {
          console.log("LOGOUT ERROR", err);
          this.router.navigate(['/auth']);
        }
      )
  }

  setOff(place: string): void {
    this.place = place;
    if (place == "free"){
      this.ntf_free = false;
    }
  }

}
