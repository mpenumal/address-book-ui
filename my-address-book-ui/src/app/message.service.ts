import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {
  message = '';

  add(message: string) {
    this.message = (message);
  }
}
