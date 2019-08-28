import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

// import Class
import { Register } from '../../classes/register';

const url = "http://localhost:3000/auth/register";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'auth-token': 'text'
  })
};

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  sendRegister(registerJson: Register): Observable<any> {
    console.log(registerJson);
    return this.http.post<any>(url, registerJson, httpOptions);
  }

}
