import { Component, OnInit } from '@angular/core';
import { SocketsService } from '../services/sockets.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chatuser',
  templateUrl: './chatuser.component.html',
  styleUrls: ['./chatuser.component.css']
})
export class ChatuserComponent implements OnInit {
  isLoading:boolean=false;
  userId:any;
  otherUserId:any;
  partyId:any;
  room:string;
  // message:string;

  constructor(private route: ActivatedRoute,private socketsService: SocketsService) { }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      this.userId=params['userId'];
      this.partyId=params['partyId'];
      this.otherUserId=params['otherUserId'];

      switch(this.userId.localeCompare(this.otherUserId)){
        case -1:
          this.room =  this.userId+this.otherUserId+this.partyId;
          // this.socketsService.connect();
          this.socketsService.connectToRoom(this.room);
          this.isLoading=true;
          break;
        case 1:
          this.room =  this.otherUserId+this.userId+this.partyId;
          // this.socketsService.connect();
          this.socketsService.connectToRoom(this.room);
          this.isLoading=true;
          break;
      }
    })
  }

  sendMessage(myForm){
    console.log("send from component");
    this.socketsService.sendMessageRoom(this.room,myForm.value);
  }

}
