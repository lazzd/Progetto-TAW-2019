import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';

import { HttpClient, HttpHeaders, HttpEventType, HttpResponse } from '@angular/common/http';

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

  // sarebbe un observable della classe del get v.2
  /*sendOrder(): Promise<Observable<any>> {
    return this.refreshToken.refreshToken()
      .then(
        (resolveRefreshToken => {
          console.log(resolveRefreshToken);
          return this.http.get(url);
        }),
        (ErrorRefreshToken => {
          //console.log(ErrorRefreshToken);
          return throwError(ErrorRefreshToken);
        })
      )
  };*/

  async sendOrder(): Promise<Observable<any>> {
    try {
      let promRefeshToken = await this.refreshToken.refreshToken();
      console.log(promRefeshToken);
      // Ora posso fare la richiesta...
      return this.http.get(url);
    } catch (ErrorRefreshToken) {
      console.log("asdasdasdas");
      return throwError(ErrorRefreshToken);
    }
  };

}
