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
        this.isLoading=true;
      });
  }

  editPartyDetails(id){
    console.log("partyId",id);
    this.router.navigate([`/profile/${this.user._id}/parties/${id}/edit`]);
  }

  editPartyPictures(id){
    console.log("partyId",id);
    this.router.navigate([`/profile/${this.user._id}/parties/${id}/images`]);
  }

  editUserDetails(id){
    console.log("partyId",id);
    this.router.navigate([`/profile/${id}/edit`]);
  }

  editUserPictures(id){
    console.log("partyId",id);
    this.router.navigate([`/profile/${id}/images`]);
  }

  goBack(){
    this.router.navigate([`/partiesSearch`]);
  }

}
