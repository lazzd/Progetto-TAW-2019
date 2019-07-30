import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';

import { HttpClient, HttpHeaders, HttpEventType, HttpResponse } from '@angular/common/http';

// import for refresh-token
import { RefreshTokenService } from '../../../refresh-token/refresh-token.service';
import { User } from 'src/app/classes/user';

const urlUser = "http://localhost:3000/users";

@Injectable({
  providedIn: 'root'
})
export class CashierStatisticsService {

  constructor(
    private refreshToken: RefreshTokenService,
    private http: HttpClient) { }

  async getAllUsers(): Promise<Observable<Array<User>>> {
    try {
      let promRefeshToken = await this.refreshToken.refreshToken();
      console.log(promRefeshToken);
      // Ora posso fare la richiesta...
      return this.http.get<Array<User>>(urlUser);
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  }

}
