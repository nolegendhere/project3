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

    // this.socket.on('greeting-from-server', (message)=> {
    //     console.log("message",message);
    //     this.socket.emit('greeting-from-client', {
    //         greeting: 'Hello Server'
    //     });
    // });
  }

  connectToRoom(room,id=null){
    this.socket = io(this.BASE_URL);
    this.socket.emit('room.join', {room:room,id:id});
  }

  connectToRooms(rooms){
    this.socket = io(this.BASE_URL);
    this.socket.emit('rooms.join', {rooms:rooms});
  }

  on(eventName:any,callback:any=null){
    if(this.socket){
      this.socket.on(eventName,(data:any)=>{
        callback(data);
      });
    }
  }

  emit(eventName:any,data:any=null){
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
