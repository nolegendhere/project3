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
  isLoading:boolean=false;
  constructor(private partiesService: PartiesService,private usersService: UsersService,private sessionService: SessionService) { }

  ngOnInit() {
    this.userId = this.sessionService.id;
    this.partiesService.getList(this.userId).subscribe((partiesObs) => {
      this.partyList = partiesObs;
      this.isLoading = true;
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
