import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartiesService } from '../services/parties.service'
import { UsersService } from '../services/users.service'

@Component({
  selector: 'app-party-single-edit',
  templateUrl: './party-single-edit.component.html',
  styleUrls: ['./party-single-edit.component.css']
})
export class PartySingleEditComponent implements OnInit {
  party: any;
  user:any;
  userId:any;
  isLoading:boolean=false;

  genders = ['BoysGirls', 'Boys',
          'Girls'];
  ageRanges = ["All","18-25","20-30","25-35","30-40","35-45","40-50","45-55","50-60","55-65"];
  payments = ["Free","Paid"];
  parities = ["equal","unchecked"];
  placeTypes = ["appartment","house","local","openAir"];
  sizes = ["small","average","big"];

  minAgeLimit: number = 18;
  maxAgeLimit: number = 65;
  minPeopleLimit: number = 2;
  maxPeopleLimit: number = 100;

  constructor(private router: Router,private route: ActivatedRoute,
  private partiesService: PartiesService,
  private usersService: UsersService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      this.getPartyDetails(params['partyId']);
    });
  }

  getPartyDetails(id) {
    this.partiesService.get(id)
      .subscribe((partyObs) => {
        this.party = partyObs;
        console.log("this.party",this.party);
        this.usersService.get(this.userId)
          .subscribe((userObs) => {
            this.user = userObs;
            this.isLoading=true;
          });
      });
  }

  submitForm(myForm) {
    myForm.value.numJoined = this.party.numOfPeople.numJoined;
    this.partiesService.edit(myForm.value,this.party._id).subscribe(() => {
      this.router.navigate([`/profile/${this.party.owner._id}/show`]);
    });;
  }

  remove(){
    this.partiesService.remove(this.party._id).subscribe(() => {
      this.router.navigate([`/profile/${this.party.owner._id}/show`]);
    });;
  }

  goBack(){
    this.router.navigate([`/profile/${this.party.owner._id}/show`]);
  }

  changeValueMinAge(value: number) {
    console.log("minAge",this.party.ageRange.minAge);
    console.log("maxAge",this.party.ageRange.maxAge);;
    if(this.party.ageRange.maxAge<this.party.ageRange.minAge)
    {
      this.party.ageRange.minAge = this.party.ageRange.maxAge;
    }

    if(this.user.profile.age<this.party.ageRange.minAge){
      this.party.ageRange.minAge = this.user.profile.age
    }
  }

  changeValueMaxAge(value: number) {
    //this.maxValue1 = this.value2;
    console.log("minAge",this.party.ageRange.minAge);
    console.log("maxAge",this.party.ageRange.maxAge);
    if(this.party.ageRange.maxAge<this.party.ageRange.minAge)
    {
      this.party.ageRange.maxAge = this.party.ageRange.minAge;
    }

    if(this.user.profile.age>this.party.ageRange.maxAge){
      this.party.ageRange.maxAge = this.user.profile.age
    }
  }

}
