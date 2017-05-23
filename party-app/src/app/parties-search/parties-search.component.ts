import { Component, OnInit } from '@angular/core';
import { PartiesService } from '../services/parties.service';

@Component({
  selector: 'app-parties-search',
  templateUrl: './parties-search.component.html',
  styleUrls: ['./parties-search.component.css']
})
export class PartiesSearchComponent implements OnInit {
  partyList:Array<any>=[];
  constructor(private partiesService: PartiesService) { }

  ngOnInit() {
    this.partiesService.getList().subscribe((partiesObs) => {
      this.partyList = partiesObs;
      console.log("esto this.dishList",this.partyList);
    });
  }

}
