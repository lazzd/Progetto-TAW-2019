import { environment } from "../../../../../environments/environment";

import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';

import { HttpClient } from '@angular/common/http';

// import for refresh-token
import { RefreshTokenService } from '../../../refresh-token/refresh-token.service';
import { Table } from 'src/app/classes/table';
import { Menu } from 'src/app/classes/menu';
import { ElementMenu } from 'src/app/classes/element_menu';
import { ReqOrder } from 'src/app/classes/req_order';
import { ResOrder } from 'src/app/classes/res_order';

const urlTable = environment.serverURL + "/tables";
const urlMenu = environment.serverURL + "/menu";
const urlOrder = environment.serverURL + "/orders";

@Injectable({
  providedIn: 'root'
})
export class WaiterOrdersService {

  constructor(
    private refreshToken: RefreshTokenService,
    private http: HttpClient) { }

  async getTablesByWaiter(waiter: string): Promise<Observable<Array<Table>>> {
    try {
      let promRefeshToken = await this.refreshToken.refreshToken();
      console.log(promRefeshToken);
      // Ora posso fare la richiesta
      return this.http.get<Array<Table>>(urlTable + '?waiter=' + waiter);
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  }

  async getMenu(): Promise<Observable<Array<Menu>>> {
    try {
      let promRefeshToken = await this.refreshToken.refreshToken();
      console.log(promRefeshToken);
      // Ora posso fare la richiesta
      return this.http.get<Array<Menu>>(urlMenu);
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  }

  async sendPUTOrder(id_order: number, drinks_order: ElementMenu[], foods_order: ElementMenu[], tot_sub_drinks: number, tot_sub_foods: number): Promise<Observable<ResOrder>> {
    try {
      let promRefeshToken = await this.refreshToken.refreshToken();
      console.log(promRefeshToken);
      // Ora posso fare la richiesta
      return this.http.put<ResOrder>(urlOrder + '/' + id_order, new ReqOrder(drinks_order, foods_order, tot_sub_drinks, tot_sub_foods));
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  }

  async sendPOSTOrder(drinks_order: ElementMenu[], foods_order: ElementMenu[], tot_sub_drinks: number, tot_sub_foods: number, table: string, waiter: string): Promise<Observable<ResOrder>> {
    try {
      let promRefeshToken = await this.refreshToken.refreshToken();
      console.log(promRefeshToken);
      // Ora posso fare la richiesta
      return this.http.post<ResOrder>(urlOrder, new ReqOrder(drinks_order, foods_order, tot_sub_drinks, tot_sub_foods, table, waiter));
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  }

}
