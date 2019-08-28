import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';

import { HttpClient } from '@angular/common/http';

// import for refresh-token
import { RefreshTokenService } from '../../../refresh-token/refresh-token.service';
import { Table } from 'src/app/classes/table';
import { State } from 'src/app/classes/state';

const url = "http://localhost:3000/tables";

@Injectable({
  providedIn: 'root'
})
export class WaiterTablesService {

  constructor(
    private refreshToken: RefreshTokenService,
    private http: HttpClient) { }

  async getTablesBySeats(seats: Number): Promise<Observable<Array<Table>>> {
    try {
      let promRefeshToken = await this.refreshToken.refreshToken();
      console.log(promRefeshToken);
      // Ora posso fare la richiesta
      return this.http.get<Array<Table>>(url + '?seats=' + seats);
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  };

  async pairTable(name_table: string, state: State): Promise<Observable<Table>> {
    console.log(name_table, state);
    try {
      let promRefeshToken = await this.refreshToken.refreshToken();
      console.log(promRefeshToken);
      // Ora posso fare la richiesta
      return this.http.put<Table>((url + '/' + name_table), state);
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  };

}
