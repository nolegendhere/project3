import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, Renderer2, Renderer,ElementRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SocketsService } from '../services/sockets.service';
import { UsersService } from '../services/users.service';
import { ConversationsService } from '../services/conversations.service'


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
  rooms:Array<any>=[];
  messageList:Array<any>=[];
  message:string;
  scrollTop:any;
  // message:string;

  constructor(private route: ActivatedRoute,private socketsService: SocketsService,private renderer:Renderer, private renderer2:Renderer2, private usersService:UsersService, private conversationsService:ConversationsService) { }

  ngOnInit() {
    console.log("scrollTop",this.scrollTop);
    this.route.params.subscribe(params=>{
      this.userId=params['userId'];
      this.partyId=params['partyId'];
      this.otherUserId=params['otherUserId'];
      this.getUserDetails(this.userId);
    })
  }

  getUserDetails(id) {
    this.usersService.get(id).subscribe((userObs) => {
      this.user = userObs;
      this.connectToSockets(this.user);
    });
  }

  connectToSockets(user){
    this.socketsService.removeListener('message.sent');
    this.socketsService.connect();
    this.socketsService.on('greeting-from-server', (message)=> {
      if(user.conversations.length){
        this.conversationsService.getList(user ._id).subscribe((conversationsObs)=>{
          this.rooms.push(String(user._id));
          conversationsObs.forEach((conversation)=>{
             this.rooms.push(conversation.room);
          })
          this.socketsService.connectToRooms(this.rooms);
          this.socketsService.emit('list.rooms');
          this.socketsService.on('list.rooms.response',(data)=>{
            this.socketsService.on('message.sent', (data)=>{
              console.log("message",data.message);
              this.messageList.push(data.message);
            });
            this.isLoading=true;
          });
        });
      }else{
        this.isLoading=true;
      }
    });
  }

  createRoom(id1,id2,id3){
    let room;
    switch(id1.localeCompare(id2)){
      case -1:
        room =  id1+id2+id3;
        break;
      case 1:
        room =  id2+id1+id3;
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
    if(myForm.value.message!==''){
      // this.socketsService.removeListener('message.sent'); // if i uncomment socket.emit('list.rooms.response', socket.rooms); in the sockets.js in socket.on('message.send',... , then i have to uncomment this because calling socket.emit('list.rooms.response', socket.rooms); would add a listener of this.socketsService.on('message.sent',... because of ngOnInit() calling getUserDetails(id), where this.socketsService.on('message.sent', is inside this.socketsService.on('list.rooms.response',...
      this.room = this.createRoom(this.userId,this.otherUserId,this.partyId);
      this.socketsService.emit('message.send', {room: this.room,message:{message:myForm.value.message, id: this.userId, username: this.user.username}});
      this.message='';

    }
  }
}
