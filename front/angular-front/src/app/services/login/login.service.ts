import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { HttpClient, HttpHeaders, HttpEventType, HttpResponse } from '@angular/common/http';

// for handler errors
import { catchError, map, tap } from 'rxjs/operators';

// import Class
import { Login } from '../../classes/login';

const url = "http://localhost:3000/auth/login";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'auth-token': 'text'
 })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  sendLogin(loginJson: Login): Observable<any> {
    console.log(loginJson);
    return this.http.post<any>(url, loginJson, httpOptions);
  }

}
