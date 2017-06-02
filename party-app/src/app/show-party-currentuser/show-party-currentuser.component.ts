import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PartiesService } from '../services/parties.service';
import { ImagesService } from '../services/images.service';

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

  api_url:string;
  isUsers:boolean=false;

  constructor(private route: ActivatedRoute,private router: Router,private partiesService: PartiesService,private imagesService: ImagesService) { }

  ngOnInit() {
    this.api_url = this.imagesService.getApiUrl('get-image/')
    this.route.params.subscribe(params=>{
      this.userId=params['userId'];
      this.getPartyDetails(params['partyId']);
    })
  }

  getPartyDetails(id) {
    this.partiesService.get(id).subscribe((partyObs) => {
        this.party = partyObs;
        this.userList = this.party.participants;
        if(this.userList.length){
          this.isUsers=true;
        }
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
    this.partiesService.leavePartyParticipant(user._id,this.party._id).subscribe((response)=>{
      this.party = response.party;
      this.userList = this.party.participants;
      console.log("this.userList",this.userList);
      this.isLoading=true;
    })
  }

}
