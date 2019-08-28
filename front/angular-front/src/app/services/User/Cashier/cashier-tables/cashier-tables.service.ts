import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';

import { HttpClient } from '@angular/common/http';

// import for refresh-token
import { RefreshTokenService } from '../../../refresh-token/refresh-token.service';
import { Table } from 'src/app/classes/table';

const urlTable = 'http://localhost:3000/tables';

@Injectable({
  providedIn: 'root'
})
export class CashierTablesService {

  constructor(
    private refreshToken: RefreshTokenService,
    private http: HttpClient) { }

  async getAllTables(): Promise<Observable<Array<Table>>> {
    try {
      let promRefeshToken = await this.refreshToken.refreshToken();
      console.log(promRefeshToken);
      // Ora posso fare la richiesta
      return this.http.get<Array<Table>>(urlTable);
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  }

  async postNewTable(name_table: string, seats: number): Promise<Observable<Table>> {
    try {
      let promRefeshToken = await this.refreshToken.refreshToken();
      console.log(promRefeshToken);
      // Ora posso fare la richiesta
      return this.http.post<Table>(urlTable, { name_table: name_table.toString(), seats: seats });
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  }

}
