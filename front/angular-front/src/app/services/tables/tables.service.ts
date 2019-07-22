import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';

import { HttpClient, HttpHeaders, HttpEventType, HttpResponse } from '@angular/common/http';

// import Class
import { Table } from '../../classes/table';
// import for refresh-token
import { RefreshTokenService } from '../refresh-token/refresh-token.service';

const url = "http://localhost:3000/tables";

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  constructor(
    private http: HttpClient,
    private refreshToken: RefreshTokenService) { }

  async getTables(): Promise<Observable<any>> {
    try {
      await this.refreshToken.refreshToken();
      //console.log(promRefeshToken);
      // Ora posso fare la richiesta...
      return this.http.get(url);
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  };

  async getTablesByName(name_table: string): Promise<Observable<any>> {
    try {
      await this.refreshToken.refreshToken();
      //console.log(promRefeshToken);
      // Ora posso fare la richiesta...
      return this.http.get(url + '/' + name_table);
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  };

  async createTables(tableJson: Table): Promise<Observable<any>> {
    try {
      await this.refreshToken.refreshToken();
      //console.log(promRefeshToken);
      // Ora posso fare la richiesta...
      return this.http.post(url, tableJson);
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  };

  async updateTables(name_table: string, state: boolean): Promise<Observable<any>> {
    try {
      await this.refreshToken.refreshToken();
      //console.log(promRefeshToken);
      // Ora posso fare la richiesta...
      return this.http.post(url + '/' + name_table, state);
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  };

}
