import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';

import { HttpClient, HttpHeaders, HttpEventType, HttpResponse } from '@angular/common/http';

// import for refresh-token
import { RefreshTokenService } from '../../../refresh-token/refresh-token.service';
import { Table } from 'src/app/classes/table';
import { State } from 'src/app/classes/state';

const url = "http://localhost:3000/tables";

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
      return this.http.get<Array<Table>>(url + '?waiter=' + waiter);
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  }
}
