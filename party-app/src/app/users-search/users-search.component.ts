import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/users.service';
import { PartiesService } from '../services/parties.service';

@Component({
  selector: 'app-users-search',
  templateUrl: './users-search.component.html',
  styleUrls: ['./users-search.component.css']
})
export class UsersSearchComponent implements OnInit {
  userList:Array<any>=[];
  isLoading:boolean=false;
  party: any;
  constructor(private route: ActivatedRoute,private router: Router,private usersService: UsersService,private partiesService: PartiesService) { }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      console.log("params['partyId']",params['partyId']);
      this.getUserDetails(params['partyId']);
    })
  }

  getUserDetails(partyId) {
    console.log(" partyId " +partyId);
    this.usersService.getList(partyId).subscribe((usersObs) => {
        this.userList = usersObs;
        console.log("this.userList",this.userList);
        this.partiesService.get(partyId).subscribe((partyObs) => {
          this.party = partyObs;
          this.isLoading=true;
        });
    });
  }

  // joinParty(id){
  //   this.usersService.addPartyCandidate(id,this.partyId).subscribe((partiesObs)=>{
  //     console.log("party Candidated");
  //   })
  // }

  joinParty(user){
    if(this.party.candidates.length){
      let exists = this.party.candidates.filter((candidate)=>{
        if(String(candidate) == String(user._id)){
          console.log("this candidate exists")
          return candidate;
        }
      });
      if(exists.length){
        console.log("exists");
        this.partiesService.addPartyParticipant(user._id,this.party._id).subscribe((partiesObs)=>{
          console.log("party Participant");
        })
      }
      else{
        this.partiesService.addPartyCandidate(user._id,this.party._id).subscribe((partiesObs)=>{
          console.log("party Candidated, already candidates");
        })
      }
    }
    else{
      this.partiesService.addPartyCandidate(user._id,this.party._id).subscribe((partiesObs)=>{
        console.log("party Candidated, without candidates");
      })
    }
  }

}
