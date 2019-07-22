import { Injectable } from '@angular/core';
// for routing
import { Router } from "@angular/router"

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private router: Router) { }

  logout(): void{
    localStorage.removeItem('AccessToken');
    localStorage.removeItem('RefreshToken');
    this.router.navigate(['/']);
  }

}
