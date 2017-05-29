import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PartiesService } from '../services/parties.service';

@Component({
  selector: 'app-party-joined-currentuser',
  templateUrl: './party-joined-currentuser.component.html',
  styleUrls: ['./party-joined-currentuser.component.css']
})
export class PartyJoinedCurrentuserComponent implements OnInit {
  partyList:Array<any>=[];
  isLoading:boolean=false;
  userId: any;
  partyLeft:any;
  constructor(private route: ActivatedRoute,private router: Router,private partiesService: PartiesService) { }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      console.log("params['id']",params['id']);
      this.userId=params['id'];
      this.getPartyList(params['id']);
    })
  }

  getPartyList(userId) {
    console.log(" partyId " + userId);
    this.partiesService.getListJoined(userId).subscribe((partiesObs) => {
        this.partyList = partiesObs;
        console.log("this.userList",this.partyList);
        this.isLoading=true;
    });
  }

  leaveParty(party){
    this.isLoading=false;
    this.partiesService.leavePartyParticipant(this.userId,party._id).subscribe((partyObs)=>{
      console.log("party Candidated");
      this.partyLeft = partyObs;
      let partyList = this.partyList.filter((party)=>{
        if(this.partyLeft._id!=party._id){
          return party;
        }
      });
      this.partyList = partyList;
      this.isLoading=true;
    })
  }

}
