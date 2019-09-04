import { environment } from "../../../../../environments/environment";

import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';

import { HttpClient } from '@angular/common/http';

// import for refresh-token
import { RefreshTokenService } from '../../../refresh-token/refresh-token.service';
import { ResOrder } from 'src/app/classes/res_order';
import { State } from 'src/app/classes/state';

const urlOrder = environment.serverURL + "/orders";
const urlMyOrder = environment.serverURL + "/orders/myOrders";

@Injectable({
  providedIn: 'root'
})
export class WaiterArrivalService {

  constructor(
    private refreshToken: RefreshTokenService,
    private http: HttpClient) { }

  async getMyArrivalOrders(): Promise<Observable<Array<ResOrder>>> {
    try {
      let promRefeshToken = await this.refreshToken.refreshToken();
      console.log(promRefeshToken);
      // Ora posso fare la richiesta
      return this.http.get<Array<ResOrder>>(urlMyOrder);
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  }

  async completeArrivalSuborder(id_order: number, id_suborder: number, type: string): Promise<Observable<ResOrder>> {
    try {
      let promRefeshToken = await this.refreshToken.refreshToken();
      console.log(promRefeshToken);
      const state = new State(true);
      state.setType(type);
      // Ora posso fare la richiesta
      return this.http.put<ResOrder>(urlOrder + '/' + id_order + '/suborders/' + id_suborder + '/complete', state);
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  }

}
