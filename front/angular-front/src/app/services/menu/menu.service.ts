import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';

import { HttpClient } from '@angular/common/http';

// import Class
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
      // Ora posso fare la richiesta
      return this.http.get(url);
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  }

  async addElementMenu(element_menuJson: ElementMenu): Promise<Observable<any>> {
    try {
      await this.refreshToken.refreshToken();
      // Ora posso fare la richiesta
      return this.http.post(url, element_menuJson);
    } catch (ErrorRefreshToken) {
      return throwError(ErrorRefreshToken);
    }
  };

}
