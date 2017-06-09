import { Component, OnInit } from '@angular/core';
import { PartiesService } from '../services/parties.service';
import { UsersService } from '../services/users.service';
import { SessionService } from '../services/session.service';
import { ImagesService } from '../services/images.service';
import { SocketsService } from '../services/sockets.service';
import { ConversationsService } from '../services/conversations.service'


@Component({
  selector: 'app-parties-search',
  templateUrl: './parties-search.component.html',
  styleUrls: ['./parties-search.component.css']
})
export class PartiesSearchComponent implements OnInit {
  partyList:Array<any>=[];
  party:any;
  counterParty:number=0;
  counterPicture:number=0;
  userId:any;
  user:any;
  picture:string;
  isParties:boolean=false;
  isLoading:boolean=false;
  api_url:string;
  room:string;
  rooms:Array<string>=[];
  messageList:Array<any>=[];
  isNotification:boolean=false;
  notificationList:Array<any>=[];
  notification:any;

  constructor(private partiesService: PartiesService,private usersService: UsersService,private sessionService: SessionService, private imagesService: ImagesService,private socketsService: SocketsService, private conversationsService:ConversationsService) { }

  ngOnInit() {
    this.userId = this.sessionService.id;
    this.api_url = this.imagesService.getApiUrl('get-image/')
    this.partiesService.getList(this.userId).subscribe((partiesObs) => {
      this.usersService.get(this.userId).subscribe((userObs)=>{
        this.user = userObs;
        if(partiesObs.length){
          console.log("partiesObs",partiesObs);
          this.partyList = partiesObs.filter((party)=>{
            let isValid:boolean=true;

            if(this.user.profile.age > party.ageRange.maxAge || this.user.profile.age < party.ageRange.minAge ){
              isValid=false;
            }

            if(this.user.profile.gender !== party.gender && party.gender!=="BoysGirls"){
              isValid=false;
            }

            if(this.user.partyPreferences.gender !== party.gender){
              isValid=false;
            }

            if(party.numOfPeople.numJoined>=party.numOfPeople.maxPeople){
              isValid=false;
            }

            if(this.user.partyPreferences.payment !== party.payment){
              isValid=false;
            }

            if(this.user.partyPreferences.parity !== party.parity){
              isValid=false;
            }

            if(this.user.partyPreferences.placeType !== party.placeType && this.user.partyPreferences.placeType!=="All"){
              isValid=false;
            }

            if(this.user.partyPreferences.size !== party.size && this.user.partyPreferences.size!=="All"){
              isValid=false;
            }

            if(isValid){
              return party;
            }
          });
          if(this.partyList.length){
            this.party = this.partyList[0];
            if(this.party.pictures.length){
              this.picture=this.party.pictures[this.counterPicture].picture;
            }
            this.isParties = true;
          }
        }
        this.connectToSockets(this.user,false,()=>{
          console.log("entra a callback de connectToSockets");
          this.isLoading=true;
        });
      });
    });
  }

  removeNotification(){
    this.isNotification=false;
    this.notificationList=[];
  }

  connectToSockets(user,isChat:boolean,callback,room=null){
    console.log("user en connectToSockets ",user);
    this.socketsService.removeListener('message.sent');
    this.socketsService.removeListener('userNotified');
    this.socketsService.connect();
    this.socketsService.on('greeting-from-server', (message)=> {
      this.rooms=[];
      this.rooms.push(String(user._id));
      if(user.conversations.length){
        this.conversationsService.getList(user._id).subscribe((conversationsObs)=>{
          conversationsObs.forEach((conversation)=>{
             this.rooms.push(conversation.room);
             console.log("this.rooms loop",this.rooms);
          })
          console.log("this.rooms",this.rooms);
          this.socketsService.connectToRooms(this.rooms);
          this.socketsService.emit('list.rooms');
          this.socketsService.on('list.rooms.response',(data)=>{
            this.socketsService.on('message.sent', (data)=>{
              console.log("message",data);
              if(isChat){
                this.messageList.push(data.message);
              }else{
                this.notificationList.push(data.message);
                this.isNotification=true;
                console.log("this.notificationList",this.notificationList);
              }
            });
            this.socketsService.on('userNotified', (data)=>{
              console.log("room notified ",data.room);;
              this.connectToSockets(user,isChat,callback,data.room);
            });
            if (typeof callback === "function") {
              callback();
            }
          });
        });
      }else{
        if(room!==null){
          this.rooms.push(room);
        }
        console.log("this.rooms",this.rooms);
        this.socketsService.connectToRooms(this.rooms);
        this.socketsService.emit('list.rooms');
        this.socketsService.on('list.rooms.response',(data)=>{
          this.socketsService.on('message.sent', (data)=>{
            console.log("message",data);
            if(isChat){
              this.messageList.push(data.message);
            }else{
              this.notificationList.push(data.message);
              this.isNotification=true;
              console.log("this.notificationList",this.notificationList);
            }
          });
          this.socketsService.on('userNotified', (data)=>{
            console.log("room notified ",data.room);;
            this.connectToSockets(user,callback,data.room);
          });
          if (typeof callback === "function") {
            callback();
          }
        });
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

  joinParty(){
    this.counterPicture=0;
    this.partiesService.get(this.party._id).subscribe((partyObs) => {
      this.party = partyObs;
      if(this.party.candidates.length){
        let exists = this.party.candidates.filter((candidate)=>{
          console.log("candidate",candidate);
          console.log("this.userId",this.userId);
          if(String(candidate) == String(this.userId)){
            console.log("this candidate exists")
            return candidate;
          }
        });
        if(exists.length){
          console.log("exists");
          this.isParties = false;
          this.room = this.createRoom(this.userId,this.party.owner._id,this.party._id);
          this.usersService.addPartyParticipant(this.userId,this.party.owner._id,this.party._id,this.room).subscribe((response)=>{
            this.counterParty++;
            if(this.counterParty<this.partyList.length){
              this.party = this.partyList[this.counterParty];
              this.picture=undefined;
              if(this.party.pictures.length){
                this.picture=this.party.pictures[this.counterPicture].picture;
              }
              this.isParties = true;
            }
            console.log("party Participant");
            console.log("this.party",this.party);
            this.connectToSockets(this.user,false,()=>{
              console.log("notifying user");
              this.socketsService.emit('notifyUser',{roomTo:response.userToNotify,room:response.conversation.room});
            },this.room);
            // this.socketsService.on('list.rooms.response',(data)=>{
            //   console.log("notifying user",response.userToNotify)
            // });
          })
        }
        else{
          this.isParties = false;
          this.usersService.addPartyCandidate(this.userId,this.party._id).subscribe(()=>{
            this.counterParty++;
            if(this.counterParty<this.partyList.length){
              this.party = this.partyList[this.counterParty];
              this.picture=undefined;
              if(this.party.pictures.length){
                this.picture=this.party.pictures[this.counterPicture].picture;
              }
              this.isParties = true;
            }
            console.log("party Candidated, already candidates");
          })
        }
      }
      else{
        this.isParties = false;
        this.usersService.addPartyCandidate(this.userId,this.party._id).subscribe(()=>{
          this.counterParty++;
          if(this.counterParty<this.partyList.length){
            this.party = this.partyList[this.counterParty];
            this.picture=undefined;
            if(this.party.pictures.length){
              this.picture=this.party.pictures[this.counterPicture].picture;
            }
            this.isParties = true;
          }
          console.log("party Candidated, without candidates");
        })
      }
    });
  }

  notJoinParty(){
    this.counterPicture=0;
    this.isParties = false;
    this.usersService.addPartyUsersSeen(this.userId,this.party._id).subscribe(()=>{
      this.counterParty++;
      if(this.counterParty<this.partyList.length){
        this.party = this.partyList[this.counterParty];
        this.picture=undefined;
        if(this.party.pictures.length){
          this.picture=this.party.pictures[this.counterPicture].picture;
        }
        this.isParties = true;
      }
      console.log("party Participant");
    })
  }

  nextPicture(){
    this.counterPicture++;
    if(this.counterPicture>=this.party.pictures.length){
      this.counterPicture=0;
    }
    this.picture=this.party.pictures[this.counterPicture].picture;
  }

  previousPicture(){
    this.counterPicture--;
    if(this.counterPicture<0){
      this.counterPicture=this.party.pictures.length-1
    }
    this.picture=this.party.pictures[this.counterPicture].picture;
  }

}
