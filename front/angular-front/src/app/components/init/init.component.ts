import { Component, OnInit } from '@angular/core';
// for routing
import { Router } from "@angular/router"

// import for refresh-token
import { RefreshTokenService } from '../../services/refresh-token/refresh-token.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss']
})
export class InitComponent implements OnInit {

  constructor(
    private auth: RefreshTokenService,
    private router: Router) { }

  ngOnInit() {
    // Scelta della route a seconda dei permessi
    (this.auth.isAuthenticated()) ? this.router.navigate(['/user']) : this.router.navigate(['/auth']);
  }

}
