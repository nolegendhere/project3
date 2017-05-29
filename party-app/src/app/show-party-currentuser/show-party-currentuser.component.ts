import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PartiesService } from '../services/parties.service';

@Component({
  selector: 'app-show-party-currentuser',
  templateUrl: './show-party-currentuser.component.html',
  styleUrls: ['./show-party-currentuser.component.css']
})
export class ShowPartyCurrentuserComponent implements OnInit {
  isLoading:boolean=false;
  party: any;
  userId:any;
  userList:Array<any>;
  constructor(private route: ActivatedRoute,private router: Router,private partiesService: PartiesService) { }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      this.userId=params['userId'];
      this.getPartyDetails(params['partyId']);
    })
  }

  getPartyDetails(id) {
    this.partiesService.get(id).subscribe((partyObs) => {
        this.party = partyObs;
        this.userList = this.party.participants;
        console.log("this.userList",this.userList);
        this.isLoading=true;
    });
  }

  seePartyCandidates(){
    this.router.navigate([`/profile/${this.userId}/parties/${this.party._id}/usersSearch`]);
  }

  goToPartiesOwned(){
    this.router.navigate([`/profile/${this.userId}/parties`]);
  }

  deleteContact(user){
    this.isLoading=false;
    this.partiesService.leavePartyParticipant(user._id,this.party._id).subscribe((partyObs)=>{
      this.party = partyObs;
      this.userList = this.party.participants;
      console.log("this.userList",this.userList);
      this.isLoading=true;
      this.isLoading=true;
    })
  }

}
