import { environment } from "../../../environments/environment";

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

// import Class
import { Login } from '../../classes/login';

const url = environment.serverURL + "/auth/login";

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
