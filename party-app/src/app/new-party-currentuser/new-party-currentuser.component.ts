import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartiesService } from '../services/parties.service';
import { UsersService } from '../services/users.service';

import { Party } from '../party/party.component'

@Component({
  selector: 'app-new-party-currentuser',
  templateUrl: './new-party-currentuser.component.html',
  styleUrls: ['./new-party-currentuser.component.css']
})
export class NewPartyCurrentuserComponent implements OnInit {
  user:any;
  isLoading:boolean=false;

  genders = ['BoysGirls', 'Boys',
          'Girls'];
  ageRanges = ["All","18-25","20-30","25-35","30-40","35-45","40-50","45-55","50-60","55-65"];
  payments = ["Free","Paid"];
  parities = ["equal","unchecked"];
  gains = ["1","2"];
  placeTypes = ["appartment","house","local","openAir"];
  sizes = ["small","average","big"];
  model = new Party('Party','BoysGirls','All','Free','Come to the best party ever',new Date(new Date().getTime()),'Casual',20,'unchecked','local','average');

  constructor(private router: Router,private route: ActivatedRoute,private partiesService: PartiesService, private usersService: UsersService) {
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

  submitForm(myForm,user) {
    this.partiesService.add(myForm.value,user).subscribe(() => {
      //TO-DO
      this.router.navigate([`/profile/${user._id}/parties`]);
    });;
  }

  goBack(id){
    this.router.navigate([`/profile/${id}/parties`]);
  }
}
