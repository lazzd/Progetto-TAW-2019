import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

// for routing
import { Router } from "@angular/router"

// logout service
import { LogoutService } from '../../../../services/logout/logout.service';

import { SocketService } from '../../../../services/socket/socket.service';

@Component({
  selector: 'app-sidenav-waiter',
  templateUrl: './sidenav-waiter.component.html',
  styleUrls: ['./sidenav-waiter.component.scss']
})
export class SidenavWaiterComponent implements OnDestroy {

  mobileQuery: MediaQueryList;

  set: boolean;

  place: string;

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
    this.place = "main";
    this.ntf_arrival = false;
    this.set = false;
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService
      .arrivalSuborder()
      .subscribe(Order => {
        if(this.place!='arrival' && !this.ntf_arrival)
          this.ntf_arrival = true;
      });
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
    if (place == "arrival"){
      this.ntf_arrival = false;
    }
  }

}
