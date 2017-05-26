import { Component, OnInit } from '@angular/core';
import { PartiesService } from '../services/parties.service'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-party-single-edit',
  templateUrl: './party-single-edit.component.html',
  styleUrls: ['./party-single-edit.component.css']
})
export class PartySingleEditComponent implements OnInit {
  party: any;
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
  minPeopleLimit: number = 5;
  maxPeopleLimit: number = 100;

  constructor(private router: Router,private route: ActivatedRoute,
  private partiesService: PartiesService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.getPartyDetails(params['id']);
    });
  }

  getPartyDetails(id) {
    this.partiesService.get(id)
      .subscribe((partyObs) => {
        this.party = partyObs;
        console.log("this.party",this.party);
        this.isLoading=true;
      });
  }

  submitForm(myForm) {
    this.partiesService.edit(myForm.value,this.party._id).subscribe(() => {
      this.router.navigate([`/profile/${this.party.owner._id}/show`]);
    });;
  }

  remove(){
    this.partiesService.remove(this.party._id).subscribe(() => {
      this.router.navigate([`/profile/${this.party.owner._id}/show`]);
    });;
  }

  goBack(id){
    this.router.navigate([`/profile/${this.party.owner._id}/show`]);
  }

  changeValueMinPeople(value: number) {
    console.log("minPeople",this.party.numOfPeople.minPeople);
    console.log("maxPeople",this.party.numOfPeople.maxPeople);
    if(this.party.numOfPeople.maxPeople<this.party.numOfPeople.minPeople+4)
    {
      this.party.numOfPeople.minPeople = this.party.numOfPeople.maxPeople-1;
    }
  }

  changeValueMaxPeople(value: number) {
    //this.maxValue1 = this.value2;
    console.log("minPeople",this.party.numOfPeople.minPeople);
    console.log("maxPeople",this.party.numOfPeople.maxPeople);
    if(this.party.numOfPeople.maxPeople<this.party.numOfPeople.minPeople+4)
    {
      this.party.numOfPeople.maxPeople = this.party.numOfPeople.minPeople+1;
    }
  }

  changeValueMinAge(value: number) {
    console.log("minAge",this.party.ageRange.minAge);
    console.log("maxAge",this.party.ageRange.maxAge);;
    if(this.party.ageRange.maxAge<this.party.ageRange.minAge+4)
    {
      this.party.ageRange.minAge = this.party.ageRange.maxAge-1;
    }
  }

  changeValueMaxAge(value: number) {
    //this.maxValue1 = this.value2;
    console.log("minAge",this.party.ageRange.minAge);
    console.log("maxAge",this.party.ageRange.maxAge);
    if(this.party.ageRange.maxAge<this.party.ageRange.minAge+4)
    {
      this.party.ageRange.maxAge = this.party.ageRange.minAge+1;
    }
  }

}
