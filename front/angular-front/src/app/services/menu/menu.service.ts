import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';

import { HttpClient, HttpHeaders, HttpEventType, HttpResponse } from '@angular/common/http';

// import Class
import { Menu } from '../../classes/menu';
import { ElementMenu } from '../../classes/element_menu';

// import for refresh-token
import { RefreshTokenService } from '../refresh-token/refresh-token.service';

const url = "http://localhost:3000/menu";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private http: HttpClient,
    private refreshToken: RefreshTokenService) { }

  async getMenu(): Promise<Observable<any>> {
    try {
      await this.refreshToken.refreshToken();
      //console.log(promRefeshToken);
      // Ora posso fare la richiesta...
      return this.http.get(url);
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  }

  async addElementMenu(element_menuJson: ElementMenu): Promise<Observable<any>> {
    try {
      await this.refreshToken.refreshToken();
      //console.log(promRefeshToken);
      // Ora posso fare la richiesta...
      return this.http.post(url, element_menuJson);
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  };

}
