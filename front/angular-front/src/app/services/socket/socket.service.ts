import { Injectable } from '@angular/core';

import { Observable, Observer } from 'rxjs';

import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000/';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket;

  constructor() { }

  initSocket(): void {
    this.socket = socketIo(SERVER_URL);
  }

  takeSuborder(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('take-suborder', (data: any) => observer.next(data));
    });
  }

}
