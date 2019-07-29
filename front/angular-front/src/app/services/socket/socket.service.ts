import { Injectable } from '@angular/core';

import { Observable, Observer } from 'rxjs';

import * as socketIo from 'socket.io-client';
import { ResOrder } from 'src/app/classes/res_order';
import { Table } from 'src/app/classes/table';

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

  newSuborder(): Observable<ResOrder> {
    return new Observable<ResOrder>(observer => {
      this.socket.on('new-suborder', (data: ResOrder) => observer.next(data));
    });
  }

  arrivalSuborder(): Observable<ResOrder> {
    return new Observable<ResOrder>(observer => {
      this.socket.on('arrival-suborder', (data: ResOrder) => observer.next(data));
    });
  }

  stateTables(): Observable<Table> {
    return new Observable<Table>(observer => {
      this.socket.on('state-tables', (data: Table) => observer.next(data));
    });
  }

}
