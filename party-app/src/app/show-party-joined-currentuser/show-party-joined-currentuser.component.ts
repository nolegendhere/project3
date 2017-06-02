import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PartiesService } from '../services/parties.service';
import { ImagesService } from '../services/images.service';

@Component({
  selector: 'app-show-party-joined-currentuser',
  templateUrl: './show-party-joined-currentuser.component.html',
  styleUrls: ['./show-party-joined-currentuser.component.css']
})
export class ShowPartyJoinedCurrentuserComponent implements OnInit {
  isLoading:boolean=false;
  party: any;
  userId:any;
  userList:Array<any>;
  currentuser:any;
  owner:any;

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
        this.owner = this.party.owner;
        this.userList = this.party.participants.filter((user)=>{
          if(user._id!=this.userId)
          {
            return user;
          }
          else{
            this.currentuser=user;
          }
        })
        console.log("this.userList",this.userList);
        if(this.userList.length){
          this.isUsers=true;
        }
        this.isLoading=true;
    });
  }

  goBack(){
    this.router.navigate([`/partiesSearch`]);
  }

}
