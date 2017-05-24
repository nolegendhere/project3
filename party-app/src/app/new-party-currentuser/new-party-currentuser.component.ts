import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartiesService } from '../services/parties.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-new-party-currentuser',
  templateUrl: './new-party-currentuser.component.html',
  styleUrls: ['./new-party-currentuser.component.css']
})
export class NewPartyCurrentuserComponent implements OnInit {
  user:any;
  isLoading:boolean=false;
  constructor(private route: ActivatedRoute,private partiesService: PartiesService, private usersService: UsersService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params)=>{
      this.getUserDetails(params['id']);
    })
  }

  getUserDetails(id){
    this.usersService.get(id).subscribe((userObs)=>{
      this.user = userObs;
      this.isLoading=true;
    })
  }

  submitForm(myForm) {
    this.partiesService.add(myForm.value).subscribe(() => {
      //TO-DO
    });;
  }
}
