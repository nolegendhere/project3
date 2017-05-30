import { Component, OnInit } from '@angular/core';
import { PartiesService } from '../services/parties.service';
import { UsersService } from '../services/users.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-parties-search',
  templateUrl: './parties-search.component.html',
  styleUrls: ['./parties-search.component.css']
})
export class PartiesSearchComponent implements OnInit {
  partyList:Array<any>=[];
  party:any;
  counter:number=0;
  userId:any;
  user:any;
  isParties:boolean=false;
  isLoading:boolean=false;
  constructor(private partiesService: PartiesService,private usersService: UsersService,private sessionService: SessionService) { }

  ngOnInit() {
    this.userId = this.sessionService.id;
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
            this.isParties = true;
          }
        }
        this.isLoading = true;
      });
    });
  }

  joinParty(){
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
        this.usersService.addPartyParticipant(this.userId,this.party._id).subscribe((partiesObs)=>{
          this.counter++;
          if(this.counter<this.partyList.length){
            this.party = this.partyList[this.counter];
            this.isParties = true;
          }
          console.log("party Participant");
        })
      }
      else{
        this.isParties = false;
        this.usersService.addPartyCandidate(this.userId,this.party._id).subscribe((partiesObs)=>{
          this.counter++;
          if(this.counter<this.partyList.length){
            this.party = this.partyList[this.counter];
            this.isParties = true;
          }
          console.log("party Candidated, already candidates");
        })
      }
    }
    else{
      this.isParties = false;
      this.usersService.addPartyCandidate(this.userId,this.party._id).subscribe((partiesObs)=>{
        this.counter++;
        if(this.counter<this.partyList.length){
          this.party = this.partyList[this.counter];
          this.isParties = true;
        }
        console.log("party Candidated, without candidates");
      })
    }
  }

  notJoinParty(){
    this.isParties = false;
    this.usersService.addPartyUsersSeen(this.userId,this.party._id).subscribe((partiesObs)=>{
      this.counter++;
      if(this.counter<this.partyList.length){
        this.party = this.partyList[this.counter];
        this.isParties = true;
      }
      console.log("party Participant");
    })
  }

}
