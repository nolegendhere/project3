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
        this.socket.emit('room.join', room);
        this.socket.emit('notification.join',(room+"notification"));
    });
    this.socket.on('room.joined', (message)=>{
      console.log("message",message);
    });
    this.socket.on('notification.joined', (message)=>{
      console.log("message",message);
    })
  }

  on(eventName:any,callback:any){
    if(this.socket){
      this.socket.on(eventName,(data:any)=>{
        callback(data);
      });
    }
  }

  emit(eventName:any,data:any){
    if(this.socket){
      this.socket.emit(eventName,data);
    }
  }

  removeListener(eventName:any){
    if(this.socket){
      this.socket.removeListener(eventName);
    }
  }

  disconnect(){
    console.log("disconnect from service");
    if(this.socket){
      this.socket.emit('disconnectsocket');
    }
  }
}
