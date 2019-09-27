import { environment } from "../../../environments/environment";

import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

// for handler errors
import { JwtHelperService } from '@auth0/angular-jwt';

// class jwtToken for ts
import { JwtToken } from 'src/app/classes/jwtToken';

const url = environment.serverURL + "/auth/refreshToken";

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService) { }

  // isAuthenticated sync
  isAuthenticated(): boolean {
    // Per vedere le richieste non devi fare un refresh dal server, ma semplicamente convalidare la presenza del token
    const saved_AccessToken = localStorage.getItem('AccessToken');
    const saved_RefreshToken = localStorage.getItem('RefreshToken');
    return saved_AccessToken && saved_RefreshToken && (!this.jwtHelper.isTokenExpired(saved_AccessToken) || !this.jwtHelper.isTokenExpired(saved_RefreshToken));
  }

  refreshToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const saved_AccessToken = localStorage.getItem('AccessToken');
      const saved_RefreshToken = localStorage.getItem('RefreshToken');
      if (saved_AccessToken && saved_RefreshToken) {
        if (!this.jwtHelper.isTokenExpired(saved_AccessToken)) {
          resolve("AccessToken doesn't expire");
        }
        else {
          // il problema del token expire deve essere da parte del server
          let body = {
            'AccessToken': saved_AccessToken,
            'RefreshToken': saved_RefreshToken
          };
          this.http.post<any>(url, body)
            .subscribe(
              ((res: JwtToken) => {
                localStorage.setItem('AccessToken', res.AccessToken);
                resolve("Created new AccessToken");
              }),
              ((err) => {
                //console.log('refreshToken ERR', err.error);
                reject(err.error);
              })
            );
        }
      }
      else {
        reject("AccessToken or RefreshToken didn't save");
      }
    });
  }

}
