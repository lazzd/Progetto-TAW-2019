import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';

import { HttpClient, HttpHeaders, HttpEventType, HttpResponse } from '@angular/common/http';

import { RefreshTokenService } from '../../../refresh-token/refresh-token.service';
import { ResOrder } from 'src/app/classes/res_order';

const urlOrder = "http://localhost:3000/orders";

@Injectable({
  providedIn: 'root'
})
export class CashierReceiptsService {

  constructor(
    private refreshToken: RefreshTokenService,
    private http: HttpClient) { }

    async getCompleteOrdersByDate(date: string): Promise<Observable<Array<ResOrder>>> {
      try {
        let promRefeshToken = await this.refreshToken.refreshToken();
        console.log(promRefeshToken);
        // Ora posso fare la richiesta...
        return this.http.get<Array<ResOrder>>(urlOrder + "?date=" + date);
      } catch (ErrorRefreshToken) {
        return throwError(ErrorRefreshToken);
      }
    }
}
