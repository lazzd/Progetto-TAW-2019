import { environment } from "../../../environments/environment";

import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

const url = environment.serverURL + "/auth/logout";

@Injectable({
  providedIn: 'root'
})

export class LogoutService {

  constructor(private http: HttpClient) { }

  logout(): Observable<any>{
    const UserName = localStorage.getItem('UserName');
    localStorage.removeItem('AccessToken');
    localStorage.removeItem('RefreshToken');
    localStorage.removeItem('UserName');
    localStorage.removeItem('UserTask');
    return this.http.post<any>(url, {UserName});
  }

}
