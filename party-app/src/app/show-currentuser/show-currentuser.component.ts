import { Component, OnInit } from '@angular/core';
'@angular/core';
import { UsersService } from '../services/users.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-show-currentuser',
  templateUrl: './show-currentuser.component.html',
  styleUrls: ['./show-currentuser.component.css']
})
export class ShowCurrentuserComponent implements OnInit {
  user:any;
  isLoading:boolean=false;
  constructor(private route: ActivatedRoute,private router: Router,private usersService: UsersService) { }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      this.getUserDetails(params['id']);
      console.log("params['id']",params['id']);
    })
  }

  getUserDetails(id) {
    this.usersService.get(id)
      .subscribe((userObs) => {
        this.user = userObs;
        this.isLoading=true;
      });
  }

  editPartyDetails(id){
    console.log("partyId",id);
    this.router.navigate([`/profile/parties/${id}/edit`]);
  }

  editUserDetails(id){
    console.log("partyId",id);
    this.router.navigate([`/profile/${id}/edit`]);
  }



}
