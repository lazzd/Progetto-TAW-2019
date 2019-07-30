import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';

import { HttpClient, HttpHeaders, HttpEventType, HttpResponse } from '@angular/common/http';

// import for refresh-token
import { RefreshTokenService } from '../../../refresh-token/refresh-token.service';
import { ResOrder } from 'src/app/classes/res_order';

const urlOrder = "http://localhost:3000/orders";

@Injectable({
  providedIn: 'root'
})
export class CashierOrdersService {

  constructor(
    private refreshToken: RefreshTokenService,
    private http: HttpClient) { }

    async getAllNotCompleteOrder(): Promise<Observable<Array<ResOrder>>> {
      try {
        let promRefeshToken = await this.refreshToken.refreshToken();
        console.log(promRefeshToken);
        // Ora posso fare la richiesta...
        return this.http.get<Array<ResOrder>>(urlOrder);
      } catch (ErrorRefreshToken) {
        return throwError(ErrorRefreshToken);
      }
    }

}
