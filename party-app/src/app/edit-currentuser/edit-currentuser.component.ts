import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-currentuser',
  templateUrl: './edit-currentuser.component.html',
  styleUrls: ['./edit-currentuser.component.css']
})
export class EditCurrentuserComponent implements OnInit {
  user:any;
  isLoading:boolean=false;
  constructor(private route: ActivatedRoute,
  private usersService: UsersService) { }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      this.getUserDetails(params['id']);
    })
  }

  getUserDetails(id) {
    this.usersService.get(id)
      .subscribe((userObs) => {
        this.user = userObs;
        this.isLoading=true;
      });
  }

}
