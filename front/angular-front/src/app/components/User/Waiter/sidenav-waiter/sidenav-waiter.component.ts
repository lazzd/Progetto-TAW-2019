import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

// for routing
import { Router } from "@angular/router"

// logout service
import { LogoutService } from '../../../../services/logout/logout.service';

@Component({
  selector: 'app-sidenav-waiter',
  templateUrl: './sidenav-waiter.component.html',
  styleUrls: ['./sidenav-waiter.component.scss']
})
export class SidenavWaiterComponent implements OnDestroy {

  mobileQuery: MediaQueryList;

  set: boolean;

  private _mobileQueryListener: () => void;

  ngOnInit() {
    this.set = false; 
  }

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private logoutService: LogoutService,
    private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout() {
    this.logoutService.logout();
    this.router.navigate(['/auth']);
  }

  setOff(): void {
    this.set = true;
    console.log(this.set);
  }

}
