import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';

import { HttpClient } from '@angular/common/http';

// import for refresh-token
import { RefreshTokenService } from '../refresh-token/refresh-token.service';

const url = "http://localhost:3000/orders";

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  constructor(
    private refreshToken: RefreshTokenService,
    private http: HttpClient) { }

  async sendOrder(): Promise<Observable<any>> {
    try {
      let promRefeshToken = await this.refreshToken.refreshToken();
      console.log(promRefeshToken);
      // Ora posso fare la richiesta
      return this.http.get(url);
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  };

}
