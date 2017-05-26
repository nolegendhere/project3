import { Component, OnInit } from '@angular/core';
import { PartiesService } from '../services/parties.service'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-party-single-edit',
  templateUrl: './party-single-edit.component.html',
  styleUrls: ['./party-single-edit.component.css']
})
export class PartySingleEditComponent implements OnInit {
  isLoading:boolean=false;

  genders = ['BoysGirls', 'Boys',
          'Girls'];
  ageRanges = ["All","18-25","20-30","25-35","30-40","35-45","40-50","45-55","50-60","55-65"];
  payments = ["Free","Paid"];
  parities = ["equal","unchecked"];
  gains = ["1","2"];
  placeTypes = ["appartment","house","local","openAir"];
  sizes = ["small","average","big"];
  party: any;

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
      //TO-DO
      this.router.navigate([`/profile/${this.party.owner._id}/show`]);
    });;
  }

  remove(){
    this.partiesService.remove(this.party._id).subscribe(() => {
      //TO-DO
      this.router.navigate([`/profile/${this.party.owner._id}/show`]);
    });;
  }

  goBack(id){
    this.router.navigate([`/profile/${this.party.owner._id}/show`]);
  }

}
