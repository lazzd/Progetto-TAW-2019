import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

// for routing
import { Router } from "@angular/router"

// logout service
import { LogoutService } from '../../../../services/logout/logout.service';

import { SocketService } from '../../../../services/socket/socket.service';

import { ElementOrder } from 'src/app/classes/element_order';
import { ElementMenu } from 'src/app/classes/element_menu';

@Component({
  selector: 'app-sidenav-cook',
  templateUrl: './sidenav-cook.component.html',
  styleUrls: ['./sidenav-cook.component.scss']
})
export class SidenavCookComponent implements OnDestroy {

  mobileQuery: MediaQueryList;

  place: string;

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
    this.place = "main";
    this.ntf_free = false;
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService
      .newSuborder()
      .subscribe(Order => {
        console.log(Order);
        // il suborder maggiore è sempre pushato nell'array (pop - last position)
        const ElementOrder: ElementOrder = Order.elements_order.pop();
        const suborder: ElementMenu[] = ElementOrder.foods_order;
        if (suborder.length > 0 && this.place!='free' && !this.ntf_free)
          this.ntf_free = true;
      });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout(){
    this.logoutService.logout();
    this.router.navigate(['/auth']);
  }

  setOff(place: string): void {
    this.place = place;
    if (place == "free"){
      this.ntf_free = false;
    }
  }

}
