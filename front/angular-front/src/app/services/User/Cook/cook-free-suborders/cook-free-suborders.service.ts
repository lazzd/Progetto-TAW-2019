import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';

import { HttpClient } from '@angular/common/http';

// import for refresh-token
import { RefreshTokenService } from '../../../refresh-token/refresh-token.service';
import { ResOrder } from 'src/app/classes/res_order';
import { ReqEmployee } from 'src/app/classes/req_employee';

const urlOrder = "http://localhost:3000/orders";

@Injectable({
  providedIn: 'root'
})
export class CookFreeSubordersService {

  constructor(
    private refreshToken: RefreshTokenService,
    private http: HttpClient) { }

  async getOrdersByCook(): Promise<Observable<Array<ResOrder>>> {
    try {
      let promRefeshToken = await this.refreshToken.refreshToken();
      console.log(promRefeshToken);
      // Ora posso fare la richiesta
      return this.http.get<Array<ResOrder>>(urlOrder);
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  }

  async takeSuborder(id_order: number, id_suborder: number, name: string): Promise<Observable<Array<ResOrder>>> {
    try {
      let promRefeshToken = await this.refreshToken.refreshToken();
      console.log(promRefeshToken);
      // Ora posso fare la richiesta
      return this.http.put<Array<ResOrder>>(urlOrder + '/' + id_order + '/suborders/' + id_suborder, new ReqEmployee(name));
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  }
}
