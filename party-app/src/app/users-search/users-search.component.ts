import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/users.service';
// import { PartiesService } from '../services/parties.service';

@Component({
  selector: 'app-users-search',
  templateUrl: './users-search.component.html',
  styleUrls: ['./users-search.component.css']
})
export class UsersSearchComponent implements OnInit {
  userList:Array<any>=[];
  isLoading:boolean=false;
  constructor(private route: ActivatedRoute,private router: Router,private usersService: UsersService) { }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      console.log("params['userId']",params['userId']);
      this.getUserDetails(params['userId'],params['partyId']);
    })
  }

  getUserDetails(userId,partyId) {
    console.log(" partyId " +partyId);
    this.usersService.getList(userId,partyId).subscribe((usersObs) => {
        this.userList = usersObs;
        console.log("this.userList",this.userList);
        this.isLoading=true;
    });
  }

}
