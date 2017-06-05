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

  connectToRoom(room){
    this.socket = io(this.BASE_URL);
    this.socket.on('connect', ()=>{
      this.socket.emit('authenticate', {token: this.sessionService.token});
    });
    this.socket.on('greeting-from-server', (message)=> {
        console.log("message",message);
        // this.socket.emit('greeting-from-client', {
        //     greeting: 'Hello Server'
        // });
        this.socket.emit('room.join', room);

    });

    this.socket.on('room.joined', (message)=>{
      console.log("message",message);
    });

    this.socket.on('message.sent',(message)=>{
      console.log("message",message);
    })
  }

  sendMessageRoom(room,message:string){
    console.log("send from service");
    this.socket.emit('message.send', {room:room,message:message});
  }

}
