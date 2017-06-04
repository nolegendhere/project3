import { Injectable } from '@angular/core';
import {SessionService} from './session.service'
import * as io from 'socket.io-client';

@Injectable()
export class SocketsService {
BASE_URL: string = 'http://localhost:3000';
socket:any;

  constructor(private sessionService:SessionService) {
  }

  connect(){
    console.log("entra");
    this.socket = io(this.BASE_URL);
    this.socket.on('connect', ()=>{
      this.socket.emit('authenticate', {token: this.sessionService.token});
    });

    this.socket.on('greeting-from-server', (message)=> {
        console.log("message",message);
        this.socket.emit('greeting-from-client', {
            greeting: 'Hello Server'
        });
    });
  }

}
