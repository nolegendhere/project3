import { Component, OnInit } from '@angular/core';
'@angular/core';
import { UsersService } from '../services/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ImagesService } from '../services/images.service';

@Component({
  selector: 'app-show-currentuser',
  templateUrl: './show-currentuser.component.html',
  styleUrls: ['./show-currentuser.component.css']
})
export class ShowCurrentuserComponent implements OnInit {
  user:any;
  isLoading:boolean=false;
  api_url:string;
  counterParty:number=0;
  party:any;
  isParties:boolean=false;
  picture:string;

  constructor(private route: ActivatedRoute,private router: Router,private usersService: UsersService, private imagesService: ImagesService) { }

  ngOnInit() {
    this.api_url = this.imagesService.getApiUrl('get-image/')
    this.route.params.subscribe(params=>{
      this.getUserDetails(params['id']);
      console.log("params['id']",params['id']);
    })
  }

  getUserDetails(id) {
    this.usersService.get(id)
      .subscribe((userObs) => {
        this.user = userObs;
        console.log("this.user",this.user);
        if(this.user.partiesOwned.length){
          this.party=this.user.partiesOwned[0];
          this.isParties=true;
          this.picture=undefined;
          if(this.party.pictures.length){
            this.picture=this.party.pictures[0].picture;
          }
        }
        this.isLoading=true;
      });
  }

  nextParty(){
    this.counterParty++;
    if(this.counterParty>=this.user.partiesOwned.length){
      this.counterParty=0;
    }
    this.party=this.user.partiesOwned[this.counterParty];
    this.picture=undefined;
    if(this.party.pictures.length){
      this.picture=this.party.pictures[0].picture;
    }
  }

  previousParty(){
    this.counterParty--;
    if(this.counterParty<0){
      this.counterParty=this.user.partiesOwned.length-1
    }
    this.party=this.user.partiesOwned[this.counterParty];
    this.picture=undefined;
    if(this.party.pictures.length){
      this.picture=this.party.pictures[0].picture;
    }
  }

  editPartyDetails(){
    this.router.navigate([`/profile/${this.user._id}/parties/${this.party._id}/edit`]);
  }

  editPartyPictures(){
    this.router.navigate([`/profile/${this.user._id}/parties/${this.party._id}/images`]);
  }

  editUserDetails(){
    this.router.navigate([`/profile/${this.user._id}/edit`]);
  }

  editUserPictures(){
    this.router.navigate([`/profile/${this.user._id}/images`]);
  }
}
