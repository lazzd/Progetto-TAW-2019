import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';

import { HttpClient, HttpHeaders, HttpEventType, HttpResponse } from '@angular/common/http';

// import for refresh-token
import { RefreshTokenService } from '../../../refresh-token/refresh-token.service';
import { Table } from 'src/app/classes/table';
import { State } from 'src/app/classes/state';
import { Menu } from 'src/app/classes/menu';

const url = "http://localhost:3000";

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
      // Ora posso fare la richiesta...
      return this.http.get<Array<Table>>(url + '/tables?waiter=' + waiter);
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  }

  async getMenu(): Promise<Observable<Array<Menu>>> {
    try {
      let promRefeshToken = await this.refreshToken.refreshToken();
      console.log(promRefeshToken);
      // Ora posso fare la richiesta...
      return this.http.get<Array<Menu>>(url + '/menu');
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  }
  
}
