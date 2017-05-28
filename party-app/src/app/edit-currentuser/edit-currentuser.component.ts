import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { SessionService } from '../services/session.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-currentuser',
  templateUrl: './edit-currentuser.component.html',
  styleUrls: ['./edit-currentuser.component.css']
})
export class EditCurrentuserComponent implements OnInit {
  user:any;
  isLoading:boolean=false;

  genders = ['Boy','Girl'];
  genderPreferences = ['Boy','Girl','BoysGirls'];
  paymentPreferences = ["Free","Paid"];
  parityPreferences = ["equal","unchecked"];
  placeTypePreferences = ["appartment","house","local","openAir"];
  sizePreferences = ["small","average","big"];

  minAgeLimit: number = 18;
  maxAgeLimit: number = 65;
  minPeopleLimit: number = 18;
  maxPeopleLimit: number = 65;


  constructor(private router: Router,private route: ActivatedRoute,
  private usersService: UsersService,private sessionService: SessionService) { }

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

  submitForm(myForm) {
    this.usersService.edit(myForm.value, this.user._id).subscribe(() => {
      this.router.navigate([`/profile/${this.user._id}/show`]);
    });;
  }

  remove(){
    this.usersService.remove(this.user._id).subscribe(() => {
      this.sessionService.logout();
    });;
  }

  goBack(){
    this.router.navigate([`/profile/${this.user._id}/show`]);
  }

  changeValueMinPeoplePreferences(value: number) {
    console.log("minPeople",this.user.partyPreferences.numOfPeople.minPeople);
    console.log("maxPeople",this.user.partyPreferences.numOfPeople.maxPeople);
    if(this.user.partyPreferences.numOfPeople.maxPeople<this.user.partyPreferences.numOfPeople.minPeople+4)
    {
    this.user.partyPreferences.numOfPeople.minPeople = this.user.partyPreferences.numOfPeople.maxPeople-1;
    }
  }

  changeValueMaxPeoplePreferences(value: number) {
    //this.maxValue1 = this.value2;
    console.log("minPeople",this.user.partyPreferences.numOfPeople.minPeople);
    console.log("maxPeople",this.user.partyPreferences.numOfPeople.maxPeople);
    if(this.user.partyPreferences.numOfPeople.maxPeople<this.user.partyPreferences.numOfPeople.minPeople+4)
    {
      this.user.partyPreferences.numOfPeople.maxPeople = this.user.partyPreferences.numOfPeople.minPeople+1;
    }
  }

  changeValueMinAgePreferences(value: number) {
    console.log("minAge",this.user.partyPreferences.ageRange.minAge);
    console.log("maxAge",this.user.partyPreferences.ageRange.maxAge);;
    if(this.user.partyPreferences.ageRange.maxAge<this.user.partyPreferences.ageRange.minAge)
    {
      this.user.partyPreferences.ageRange.minAge = this.user.partyPreferences.ageRange.maxAge;
    }

    if(this.user.profile.age<this.user.partyPreferences.ageRange.minAge){
      this.user.partyPreferences.ageRange.minAge = this.user.profile.age
    }
  }

  changeValueMaxAgePreferences(value: number) {
    console.log("minAge",this.user.partyPreferences.ageRange.minAge);
    console.log("maxAge",this.user.partyPreferences.ageRange.maxAge);
    if(this.user.partyPreferences.ageRange.maxAge<this.user.partyPreferences.ageRange.minAge)
    {
      this.user.partyPreferences.ageRange.maxAge = this.user.partyPreferences.ageRange.minAge;
    }

    if(this.user.profile.age>this.user.partyPreferences.ageRange.maxAge){
      this.user.partyPreferences.ageRange.maxAge = this.user.profile.age+1
    }
  }

  changeValueAge(value: number) {
    //this.maxValue1 = this.value2;
    console.log("age",this.user.profile.age);
    if(this.user.profile.age<this.user.partyPreferences.ageRange.minAge){
      this.user.partyPreferences.ageRange.minAge = this.user.profile.age
    }

    if(this.user.profile.age>this.user.partyPreferences.ageRange.maxAge){
      this.user.partyPreferences.ageRange.maxAge = this.user.profile.age
    }
  }

}
