import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';

// import for refresh-token
import { RefreshTokenService } from '../refresh-token/refresh-token.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(
    private auth: RefreshTokenService,
    private router: Router,
    private jwt: JwtHelperService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedTask = route.data.expectedTask;
    // decode the token to get its payload
    const task = this.jwt.decodeToken(localStorage.getItem('AccessToken')).task;
    if (!this.auth.isAuthenticated() || task != expectedTask) {
      this.router.navigate(['/user']);
      return false;
    }
    return true;
  }
}
