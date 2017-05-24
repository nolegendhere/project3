import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-party-list-currentuser',
  templateUrl: './party-list-currentuser.component.html',
  styleUrls: ['./party-list-currentuser.component.css']
})
export class PartyListCurrentuserComponent implements OnInit {
  partyList:Array<any>=[];
  user:any;
  isLoading:boolean=false;
  constructor(private route: ActivatedRoute,private usersService: UsersService) { }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      this.getUserDetails(params['id']);
    })
  }

  getUserDetails(id) {
    this.usersService.get(id).subscribe((userObs) => {
        this.user = userObs;
        this.isLoading=true;
    });
  }
}
