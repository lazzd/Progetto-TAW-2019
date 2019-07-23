import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

// import for refresh-token
import { RefreshTokenService } from '../refresh-token/refresh-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(
    private auth: RefreshTokenService,
    private router: Router) { }

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/auth']);
      return false;
    }
    return true;
  }

}
