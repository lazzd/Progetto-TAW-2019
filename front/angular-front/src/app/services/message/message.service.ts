import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: string[] = [];

  constructor() { }

  // add the message on the messages' cache
  add(message: string): void {
    this.messages.push(message);
  }

  // clear the cache
  clear(): void {
    this.messages = [];
  }

}
