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
  userId:any;
  user:any;
  isLoading:boolean=false;
  constructor(private partiesService: PartiesService,private usersService: UsersService,private sessionService: SessionService) { }

  ngOnInit() {
    this.userId = this.sessionService.id;
    this.partiesService.getList(this.userId).subscribe((partiesObs) => {
      // this.partyList = partiesObs;
      this.usersService.get(this.userId).subscribe((userObs)=>{
        this.user = userObs;
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
        })
        this.isLoading = true;
      });
    });
  }

  joinParty(party){

    if(party.candidates.length){
      let exists = party.candidates.filter((candidate)=>{
        console.log("candidate",candidate);
        console.log("this.userId",this.userId);
        if(String(candidate._id) == String(this.userId)){
          console.log("this candidate exists")
          return candidate;
        }
      });
      if(exists.length){
        console.log("exists");
        this.usersService.addPartyParticipant(this.userId,party._id).subscribe((partiesObs)=>{
          console.log("party Participant");
        })
      }
      else{
        this.usersService.addPartyCandidate(this.userId,party._id).subscribe((partiesObs)=>{
          console.log("party Candidated, already candidates");
        })
      }
    }
    else{
      this.usersService.addPartyCandidate(this.userId,party._id).subscribe((partiesObs)=>{
        console.log("party Candidated, without candidates");
      })
    }
  }

}
