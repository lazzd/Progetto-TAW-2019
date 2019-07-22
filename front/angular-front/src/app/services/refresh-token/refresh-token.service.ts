import { Injectable } from '@angular/core';

import { Observable, of, iif } from 'rxjs';

import { HttpClient, HttpHeaders, HttpEventType, HttpResponse } from '@angular/common/http';

// for handler errors
import { catchError, map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

// class jwtToken for ts
import { JwtToken } from 'src/app/classes/jwtToken';

const url = "http://localhost:3000/auth/refresh-token";

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService) { }

    // isAuthenticated async with request of a new Token from server
    /*async isAuthenticated(): Promise<boolean>{
      // da vedere l'implementazione. Per vedere le richieste non devi fare un refresh dal server, ma semplicamente convalidare la presenza del token...
      try{
        let respose = await this.refreshToken();
        return true;
      } catch(err){
        return false;
      }
    }*/

    // isAuthenticated sync
    isAuthenticated(): boolean{
      // da vedere l'implementazione. Per vedere le richieste non devi fare un refresh dal server, ma semplicamente convalidare la presenza del token...
      const saved_AccessToken = localStorage.getItem('AccessToken');
      const saved_RefreshToken = localStorage.getItem('RefreshToken');
      return saved_AccessToken && saved_RefreshToken && (!this.jwtHelper.isTokenExpired(saved_AccessToken) || !this.jwtHelper.isTokenExpired(saved_RefreshToken));
    }

  // refresh new access-token thanks to refres-token

  // REFRESH-TOKEN V.1
  /*refreshToken() {
    //devi farla asincrono...
    const saved_AccessToken = localStorage.getItem('AccessToken');
    const saved_RefreshToken = localStorage.getItem('RefreshToken');
    // fai controllo anche nel caso in cui il token proprio non ci sia in local host
    if (saved_AccessToken && saved_RefreshToken && !this.jwtHelper.isTokenExpired(saved_RefreshToken)) {
      //posso richiedere
      let body = {
        'AccessToken': saved_AccessToken,
        'RefreshToken': saved_RefreshToken
      };
      this.http.post(url, body)
        .subscribe(
          // crea il model della respose...
          (res: any) => {
            localStorage.setItem('AccessToken', res.AccessToken);
            localStorage.setItem('RefreshToken', res.RefreshToken);
          }
        )
    } else {
      // devo fare nuovo form
    }

  }*/

  /*refreshToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const saved_AccessToken = localStorage.getItem('AccessToken');
      const saved_RefreshToken = localStorage.getItem('RefreshToken');
      if(saved_AccessToken && saved_RefreshToken){
        if(!this.jwtHelper.isTokenExpired(saved_AccessToken)){
          resolve("OK");
        }
        else{
          // il problema del token expire dovrebbe essere da parte del server...
          if(!this.jwtHelper.isTokenExpired(saved_RefreshToken)){
            let body = {
              'AccessToken': saved_AccessToken,
              'RefreshToken': saved_RefreshToken
            };
            this.http.post<any>(url, body)
              .subscribe(
                ((res) => {
                  console.log('refreshToken RES', res);
                  localStorage.setItem('AccessToken', res.AccessToken);
                  localStorage.setItem('RefreshToken', res.RefreshToken);
                  resolve("OK");
                }),
                ((err) => {
                  // da vedere cosa ti da indietro...
                  console.log('refreshToken ERR', err);
                  reject("NO");
                })
              );
          }
          else{
            reject("NO");
          }
        }
      }
      else{
        reject("NO");
      }
    });
  }*/


  // DA CAPIRE SE OGNI VOLTA DOBBIAMO RI GENERARE ANCHE IL REFRESHED TOKEN OPPURE METTERE SEPRE QUELLO, SE SEMPRE QUELLO NON NECESSARIO RI METTERLO IN LOCALSTORAGE
  // se sempre quello creare due classi, una per jwtToken after Login (con 2 key) ed una per jwtTokenRefresh con solo una entry per l'AccessToken
  refreshToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const saved_AccessToken = localStorage.getItem('AccessToken');
      const saved_RefreshToken = localStorage.getItem('RefreshToken');
      if(saved_AccessToken && saved_RefreshToken){
        if(!this.jwtHelper.isTokenExpired(saved_AccessToken)){
          resolve("AccessToken doesn't expire");
        }
        else{
          // il problema del token expire dovrebbe essere da parte del server...
          let body = {
            'AccessToken': saved_AccessToken,
            'RefreshToken': saved_RefreshToken
          };
          this.http.post<any>(url, body)
            .subscribe(
              // res è un JSON...
              ((res: JwtToken) => {
                //console.log('refreshToken RES', res);
                localStorage.setItem('AccessToken', res.AccessToken);
                //localStorage.setItem('RefreshToken', res.RefreshToken);
                resolve("Created new AccessToken");
              }),
              ((err) => {
                // da vedere cosa ti da indietro...
                //console.log('refreshToken ERR', err.error);
                reject(err.error);
              })
            );
        }
      }
      else{
        reject("AccessToken or RefreshToken didn't save");
      }
    });
  }

}
