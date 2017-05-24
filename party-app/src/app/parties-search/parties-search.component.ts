import { Component, OnInit } from '@angular/core';
import { PartiesService } from '../services/parties.service';

@Component({
  selector: 'app-parties-search',
  templateUrl: './parties-search.component.html',
  styleUrls: ['./parties-search.component.css']
})
export class PartiesSearchComponent implements OnInit {
  partyList:Array<any>=[];
  userId:any;
  isLoading:boolean=false;
  constructor(private partiesService: PartiesService) { }

  ngOnInit() {
    this.partiesService.getList().subscribe((partiesObs) => {
      this.partyList = partiesObs;
      this.userId = this.partiesService.userId;
      this.isLoading = true;
      console.log("this.userId",this.userId);
      console.log("esto this.partyList",this.partyList);
    });
  }

}
