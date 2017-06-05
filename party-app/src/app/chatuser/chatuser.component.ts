import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, Renderer2, Renderer,ElementRef} from '@angular/core';
import { SocketsService } from '../services/sockets.service';
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
  otherUserId:any;
  partyId:any;
  room:string;
  messageList:Array<any>=[];
  message:string;
  scrollTop:any;
  // message:string;

  constructor(private route: ActivatedRoute,private socketsService: SocketsService,private renderer:Renderer, private renderer2:Renderer2) { }

  ngOnInit() {
    console.log("scrollTop",this.scrollTop);
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
          this.socketsService.on('message.sent', (data)=>{
            console.log("message",data.message);
            this.messageList.push(data.message);
          });
          break;
        case 1:
          this.room =  this.otherUserId+this.userId+this.partyId;
          // this.socketsService.connect();
          this.socketsService.connectToRoom(this.room);
          this.socketsService.on('message.sent', (data)=>{
            console.log("message",data.message);
            this.messageList.push(data.message);
          });
          this.isLoading=true;
          break;
      }
    })
  }

  ngAfterViewInit(){
    this.renderer2.setAttribute(this.scrollRef.nativeElement,'focus','true');
    this.inputRef.nativeElement.focus();
    //this.renderer.invokeElementMethod(this.inputRef.nativeElement,'focus')
  }

  ngAfterViewChecked(){
    this.inputRef.nativeElement.focus();
    this.scrollRef.nativeElement.scrollTop=this.scrollRef.nativeElement.scrollHeight;
  }

  sendMessage(myForm){
    console.log("send from component");
    if(myForm.value.message!==''){
      this.socketsService.emit('message.send', {room: this.room,message:{message:myForm.value.message, id: this.userId} });
      this.message='';

    }
  }

  disconnect(){
    console.log("disconnect from component");
    this.socketsService.disconnect();
  }

}
