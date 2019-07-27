import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

// for routing
import { Router } from "@angular/router"

// logout service
import { LogoutService } from '../../../../services/logout/logout.service';

@Component({
  selector: 'app-sidenav-cook',
  templateUrl: './sidenav-cook.component.html',
  styleUrls: ['./sidenav-cook.component.scss']
})
export class SidenavCookComponent implements OnDestroy {

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

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

  logout(){
    this.logoutService.logout();
    this.router.navigate(['/auth']);
  }
}
