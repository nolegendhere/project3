import { Component, OnInit } from '@angular/core';
import { PartiesService } from '../services/parties.service';
import { UsersService } from '../services/users.service';
import { SessionService } from '../services/session.service';
import { ImagesService } from '../services/images.service';

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

  constructor(private partiesService: PartiesService,private usersService: UsersService,private sessionService: SessionService, private imagesService: ImagesService) { }

  ngOnInit() {
    this.userId = this.sessionService.id;
    this.api_url = this.imagesService.getApiUrl('get-image/')
    this.partiesService.getList(this.userId).subscribe((partiesObs) => {
      // this.partyList = partiesObs;
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
        this.isLoading = true;
      });
    });
  }

  joinParty(){
    this.counterPicture=0;
    if(this.party.candidates.length){
      let exists = this.party.candidates.filter((candidate)=>{
        console.log("candidate",candidate);
        console.log("this.userId",this.userId);
        if(String(candidate._id) == String(this.userId)){
          console.log("this candidate exists")
          return candidate;
        }
      });
      if(exists.length){
        console.log("exists");
        this.isParties = false;
        this.usersService.addPartyParticipant(this.userId,this.party._id).subscribe(()=>{
          this.counterParty++;
          if(this.counterParty<this.partyList.length){
            this.party = this.partyList[this.counterParty];
            this.picture=this.party.pictures[this.counterPicture].picture;
            this.isParties = true;
          }
          console.log("party Participant");
        })
      }
      else{
        this.isParties = false;
        this.usersService.addPartyCandidate(this.userId,this.party._id).subscribe(()=>{
          this.counterParty++;
          if(this.counterParty<this.partyList.length){
            this.party = this.partyList[this.counterParty];
            this.picture=this.party.pictures[this.counterPicture].picture;
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
          this.picture=this.party.pictures[this.counterPicture].picture;
          this.isParties = true;
        }
        console.log("party Candidated, without candidates");
      })
    }
  }

  notJoinParty(){
    this.counterPicture=0;
    this.isParties = false;
    this.usersService.addPartyUsersSeen(this.userId,this.party._id).subscribe(()=>{
      this.counterParty++;
      if(this.counterParty<this.partyList.length){
        this.party = this.partyList[this.counterParty];
        this.picture=this.party.pictures[this.counterPicture].picture;
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
