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
  placeTypes = ["appartment","house","local","openAir"];
  sizes = ["small","average","big"];
  model = new Party('Party','BoysGirls',18,65,'Free','Come to the best party ever',20,'unchecked','local','average');

  minAgeLimit: number = 18;
  maxAgeLimit: number = 65;
  minPeopleLimit: number = 5;
  maxPeopleLimit: number = 100;

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

  submitForm(myForm) {
    this.partiesService.add(myForm.value,this.user).subscribe(() => {
      this.router.navigate([`/profile/${this.user._id}/parties`]);
    });;
  }

  goBack(){
    this.router.navigate([`/profile/${this.user._id}/parties`]);
  }

  changeValueMinAge(value: number) {
    console.log("minAge",this.model.minAge);
    console.log("maxAge",this.model.maxAge);;
    if(this.model.maxAge<this.model.minAge)
    {
      this.model.minAge = this.model.maxAge;
    }

    if(this.user.profile.age<this.model.minAge){
      this.model.minAge = this.user.profile.age
    }
  }

  changeValueMaxAge(value: number) {
    //this.maxValue1 = this.value2;
    console.log("minAge",this.model.minAge);
    console.log("maxAge",this.model.maxAge);
    if(this.model.maxAge<this.model.minAge)
    {
      this.model.maxAge = this.model.minAge;
    }

    if(this.user.profile.age>this.model.maxAge){
      this.model.maxAge = this.user.profile.age
    }
  }
}
