import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, Renderer2, Renderer,ElementRef} from '@angular/core';
import { SocketsService } from '../services/sockets.service';
import {UsersService} from '../services/users.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chatuser',
  templateUrl: './chatuser.component.html',
  styleUrls: ['./chatuser.component.css']
})
export class ChatuserComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('scrollRef') scrollRef:ElementRef;
  @ViewChild('inputRef') inputRef:ElementRef;
  isLoading:boolean=false;
  userId:any;
  user: any;
  otherUserId:any;
  partyId:any;
  room:string;
  messageList:Array<any>=[];
  message:string;
  scrollTop:any;
  // message:string;

  constructor(private route: ActivatedRoute,private socketsService: SocketsService,private renderer:Renderer, private renderer2:Renderer2, private usersService:UsersService) { }

  ngOnInit() {
    console.log("scrollTop",this.scrollTop);
    this.route.params.subscribe(params=>{
      this.userId=params['userId'];
      this.partyId=params['partyId'];
      this.otherUserId=params['otherUserId'];
      this.getUserDetails(this.userId);
      //this.socketsService.connect();
      this.socketsService.on('message.sent', (data)=>{
        console.log("message",data.message);
        this.messageList.push(data.message);
      });
    })
  }

  getUserDetails(id) {
    this.usersService.get(id)
      .subscribe((userObs) => {
        this.user = userObs;
        console.log("this.user",this.user);
        
        this.isLoading=true;
        this.room = this.createRoom(this.userId,this.otherUserId,this.partyId);
        //this.socketsService.connectToRoom(this.room);
      });
  }

  createRoom(id1,id2,id3){
    let room;
    switch(id1.localeCompare(id2)){
      case -1:
        room =  id1+id2+id3;
        // this.socketsService.connect();
        break;
      case 1:
        room =  id2+id1+id3;
        // this.socketsService.connect();
        break;
    }
    return room;
  }

  ngAfterViewInit(){
    //this.inputRef.nativeElement.focus();
    //this.renderer.invokeElementMethod(this.inputRef.nativeElement,'focus')
  }

  ngAfterViewChecked(){
    //this.inputRef.nativeElement.focus();
    //this.scrollRef.nativeElement.scrollTop=this.scrollRef.nativeElement.scrollHeight;
  }

  sendMessage(myForm){
    console.log("send from component",this.room);
    if(myForm.value.message!==''){
      console.log("sending");
      this.socketsService.emit('message.send', {room: this.room,message:{message:myForm.value.message, id: this.userId, username: this.user.username}});
      this.message='';

    }
  }
}
