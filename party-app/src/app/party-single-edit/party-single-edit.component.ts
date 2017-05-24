import { Component, OnInit } from '@angular/core';
import { PartiesService } from '../services/parties.service'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-party-single-edit',
  templateUrl: './party-single-edit.component.html',
  styleUrls: ['./party-single-edit.component.css']
})
export class PartySingleEditComponent implements OnInit {
  party: any;
  isLoading:boolean=false;
  constructor(private route: ActivatedRoute,
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
        this.isLoading=true;
      });
  }

}
