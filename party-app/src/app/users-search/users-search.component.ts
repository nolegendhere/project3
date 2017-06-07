import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/users.service';
import { PartiesService } from '../services/parties.service';
import { ImagesService } from '../services/images.service';
import { SocketsService } from '../services/sockets.service';
import { ConversationsService } from '../services/conversations.service'

@Component({
  selector: 'app-users-search',
  templateUrl: './users-search.component.html',
  styleUrls: ['./users-search.component.css']
})
export class UsersSearchComponent implements OnInit {
  userList:Array<any>=[];
  isUsers:boolean=false;
  isLoading:boolean=false;
  api_url:string;
  party: any;
  userId: any;
  user: any;
  picture:string;
  counterUser:number=0;
  counterPicture:number=0;
  room:string;
  rooms:Array<string>=[];
  notification:any;

  constructor(private route: ActivatedRoute,private router: Router,private usersService: UsersService,private partiesService: PartiesService, private imagesService: ImagesService,private socketsService: SocketsService, private conversationsService:ConversationsService) { }

  ngOnInit() {
    this.api_url = this.imagesService.getApiUrl('get-image/')
    this.route.params.subscribe(params=>{
      console.log("params['partyId']",params['partyId']);
      this.userId=params['userId'];
      this.getUserDetails(params['partyId']);
    })
  }

  getUserDetails(partyId) {
    console.log(" partyId " +partyId);
    this.usersService.getList(partyId).subscribe((usersObs) => {
      //console.log("usersObs",usersObs);
        // this.userList = usersObs;
        this.partiesService.get(partyId).subscribe((partyObs) => {
          this.party = partyObs;
          console.log("this.party",this.party);
          if(usersObs.length){
            this.userList = usersObs.filter((user)=>{
              let isValid:boolean=true;

              if(user.profile.age > this.party.ageRange.maxAge || user.profile.age < this.party.ageRange.minAge ){
                isValid=false;
              }

              if(user.profile.gender !== this.party.gender && this.party.gender!=="BoysGirls"){
                isValid=false;
              }

              if(user.partyPreferences.gender !== this.party.gender){
                isValid=false;
              }

              if(this.party.numOfPeople.numJoined>=this.party.numOfPeople.maxPeople){
                isValid=false;
              }

              if(user.partyPreferences.payment !== this.party.payment){
                isValid=false;
              }

              if(user.partyPreferences.parity !== this.party.parity){
                isValid=false;
              }

              if(user.partyPreferences.placeType !== this.party.placeType && user.partyPreferences.placeType!=="All"){
                isValid=false;
              }

              if(user.partyPreferences.size !== this.party.size && user.partyPreferences.size!=="All"){
                isValid=false;
              }

              if(isValid){
                return user;
              }
            });
            if(this.userList.length){
              console.log("entra aqui///////////////////////////////");
              this.user= this.userList[0];
              if(this.user.profile.pictures.length){
                this.picture=this.user.profile.pictures[this.counterPicture].picture;
              }
              this.isUsers = true;
            }
          }
          console.log("this.party.owner",this.party.owner);
          this.connectToSockets(this.party.owner,()=>{
            this.isLoading=true;
          });
        });
    });
  }

  connectToSockets(user,callback,room=null){
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
              console.log("message",data.message);
            });
            this.socketsService.on('userNotified', (data)=>{
              console.log("room notified ",data.room);;
              this.connectToSockets(user,callback,data.room);
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
            console.log("message",data.message);
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
          console.log("this.user",this.user);
          if(String(candidate) == String(this.user._id)){
            console.log("this candidate exists")
            return candidate;
          }
        });
        if(exists.length){
          console.log("exists");
          this.isUsers = false;
          this.room = this.createRoom(this.user._id,this.party.owner._id,this.party._id);
          this.partiesService.addPartyParticipant(this.user._id,this.party.owner._id,this.party._id,this.room).subscribe((response)=>{
            this.party = response.party;
            console.log("this.party ",this.party )
            console.log("this.party._id ",this.party._id )
            this.counterUser++;
            if(this.counterUser<this.userList.length){
              this.user = this.userList[this.counterUser];
              this.picture=undefined;
              if(this.user.profile.pictures.length){
                this.picture=this.user.profile.pictures[this.counterPicture].picture;
              }
              this.isUsers = true;
            }
            console.log("party Participant");
            console.log("this.party",this.party);
            this.connectToSockets(this.party.owner,()=>{
              this.socketsService.emit('notifyUser',{roomTo:response.userToNotify,room:response.conversation.room});
            },this.room);
            // this.socketsService.on('list.rooms.response',(data)=>{
            //   console.log("notifying user",response.userToNotify)

            // });
          })
        }
        else{
          this.isUsers = false;
          this.partiesService.addPartyCandidate(this.user._id,this.party._id).subscribe((response)=>{
            this.party = response.party;
            console.log("this.party ",this.party )
            console.log("this.party._id ",this.party._id );
            this.counterUser++;
            if(this.counterUser<this.userList.length){
              this.user = this.userList[this.counterUser];
              this.picture=undefined;
              if(this.user.profile.pictures.length){
                this.picture=this.user.profile.pictures[this.counterPicture].picture;
              }
              this.isUsers = true;
            }
            console.log("party Candidated, already candidates");
          })
        }
      }
      else{
        this.isUsers = false;
        this.partiesService.addPartyCandidate(this.user._id,this.party._id).subscribe((response)=>{
          this.party = response.party;
          console.log("this.party ",this.party );
          console.log("this.party._id ",this.party._id )
          this.counterUser++;
          if(this.counterUser<this.userList.length){
            this.user = this.userList[this.counterUser];
            this.picture=undefined;
            if(this.user.profile.pictures.length){
              this.picture=this.user.profile.pictures[this.counterPicture].picture;
            }
            this.isUsers = true;
          }
          console.log("party Candidated, without candidates");
        })
      }
    });
  }

  notJoinParty(){
    this.counterPicture=0;
    this.isUsers = false;
    this.partiesService.addPartyPartiesSeen(this.user._id,this.party._id).subscribe(()=>{
      this.counterUser++;
      if(this.counterUser<this.userList.length){
        this.user = this.userList[this.counterUser];
        this.picture=undefined;
        if(this.user.profile.pictures.length){
          this.picture=this.user.profile.pictures[this.counterPicture].picture;
        }
        this.isUsers = true;
      }
      console.log("party Participant");
    })
  }

  nextPicture(){
    this.counterPicture++;
    if(this.counterPicture>=this.user.profile.pictures.length){
      this.counterPicture=0;
    }
    this.picture=this.user.profile.pictures[this.counterPicture].picture;
  }

  previousPicture(){
    this.counterPicture--;
    if(this.counterPicture<0){
      this.counterPicture=this.user.profile.pictures.length-1
    }
    this.picture=this.user.profile.pictures[this.counterPicture].picture;
  }

  showParty(){
    this.router.navigate([`/profile/${this.userId}/parties/${this.party._id}/show`]);
  }

  goToPartiesOwned(){
    this.router.navigate([`/profile/${this.userId}/parties`]);
  }

}
