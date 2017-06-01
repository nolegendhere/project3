import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/users.service';
import { PartiesService } from '../services/parties.service';
import { ImagesService } from '../services/images.service';

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

  constructor(private route: ActivatedRoute,private router: Router,private usersService: UsersService,private partiesService: PartiesService, private imagesService: ImagesService) { }

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
        // this.userList = usersObs;
        this.partiesService.get(partyId).subscribe((partyObs) => {
          this.party = partyObs;
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
              this.user= this.userList[0];
              if(this.user.profile.pictures.length){
                this.picture=this.user.profile.pictures[this.counterPicture].picture;
              }
              this.isUsers = true;
            }
          }
          this.isLoading=true;
        });
    });
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
          this.partiesService.addPartyParticipant(this.user._id,this.party._id).subscribe((partyObs)=>{
            this.party = partyObs.party;
            console.log("this.party ",this.party )
            console.log("this.party._id ",this.party._id )
            this.counterUser++;
            if(this.counterUser<this.userList.length){
              this.user = this.userList[this.counterUser];
              if(this.user.profile.pictures.length){
                this.picture=this.user.profile.pictures[this.counterPicture].picture;
              }
              this.isUsers = true;
            }
            console.log("party Participant");
          })
        }
        else{
          this.partiesService.addPartyCandidate(this.user._id,this.party._id).subscribe((partyObs)=>{
            this.party = partyObs.party;
            console.log("this.party ",this.party )
            console.log("this.party._id ",this.party._id );
            this.counterUser++;
            if(this.counterUser<this.userList.length){
              this.user = this.userList[this.counterUser];
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
        this.partiesService.addPartyCandidate(this.user._id,this.party._id).subscribe((partyObs)=>{
          this.party = partyObs.party;
          console.log("this.party ",this.party );
          console.log("this.party._id ",this.party._id )
          this.counterUser++;
          if(this.counterUser<this.userList.length){
            this.user = this.userList[this.counterUser];
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
