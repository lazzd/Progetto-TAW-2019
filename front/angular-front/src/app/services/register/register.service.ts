import { environment } from "../../../environments/environment";

import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

// import Class
// import for refresh-token
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { Register } from '../../classes/register';

const url = environment.serverURL + "/auth/register";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private refreshToken: RefreshTokenService,
    private http: HttpClient) { }


  async sendRegister(registerJson: Register): Promise<Observable<string>> {
    try {
      let promRefeshToken = await this.refreshToken.refreshToken();
      console.log(promRefeshToken);
      // Ora posso fare la richiesta
      return this.http.post<string>(url, registerJson);
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  }

}
