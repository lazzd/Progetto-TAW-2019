import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';

import { HttpClient, HttpHeaders, HttpEventType, HttpResponse } from '@angular/common/http';

// import for refresh-token
import { RefreshTokenService } from '../../../refresh-token/refresh-token.service';
import { ResOrder } from 'src/app/classes/res_order';
import { State } from 'src/app/classes/state';
import { Table } from 'src/app/classes/table';

const urlOrder = "http://localhost:3000/orders";
const urlTable = "http://localhost:3000/tables";

@Injectable({
  providedIn: 'root'
})
export class CashierBillService {

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

  async table(name_table: string): Promise<Observable<Array<Table>>> {
    try {
      let promRefeshToken = await this.refreshToken.refreshToken();
      console.log(promRefeshToken);
      // Ora posso fare la richiesta...
      return this.http.put<Array<Table>>(urlTable + '/' + name_table, new State(false));
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  }

  async completeOrder(id_order: number): Promise<Observable<Array<ResOrder>>> {
    try {
      let promRefeshToken = await this.refreshToken.refreshToken();
      console.log(promRefeshToken);
      return this.http.put<Array<ResOrder>>(urlOrder + '/' + id_order + '/complete', new State(true));
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  }

}
