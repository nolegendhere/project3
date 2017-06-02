import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PartiesService } from '../services/parties.service';
import { ImagesService } from '../services/images.service';

@Component({
  selector: 'app-party-joined-currentuser',
  templateUrl: './party-joined-currentuser.component.html',
  styleUrls: ['./party-joined-currentuser.component.css']
})
export class PartyJoinedCurrentuserComponent implements OnInit {
  partyList:Array<any>=[];
  isLoading:boolean=false;
  userId: any;
  partyLeft:any;

  api_url:string;
  counterParty:number=0;
  counterParty1:number=1;
  counterParty2:number=2;
  parties:Array<any>=[];
  isParties:boolean=false;
  pictures:Array<any>=[];

  constructor(private route: ActivatedRoute,private router: Router,private partiesService: PartiesService,private imagesService: ImagesService) { }

  ngOnInit() {
    this.api_url = this.imagesService.getApiUrl('get-image/')
    this.route.params.subscribe(params=>{
      console.log("params['id']",params['id']);
      this.userId=params['id'];
      this.getPartyList(params['id']);
    })
  }

  getPartyList(userId) {
    console.log(" partyId " + userId);
    this.partiesService.getListJoined(userId).subscribe((partiesObs) => {
        this.partyList = partiesObs;
        console.log("this.userList",this.partyList);
        if(this.partyList.length){
          this.parties.push(this.partyList[0]);
          if(this.partyList[0].pictures.length){
            this.pictures.push({name:this.partyList[0].name,id:this.partyList[0]._id,picture:this.partyList[0].pictures[0].picture});
          }else{
            this.pictures.push({name:this.partyList[0].name,id:this.partyList[0]._id,picture:"empty.png"});
          }

          for(let i=1; i<3; i++){
            if(i<this.partyList.length){
              this.parties.push(this.partyList[i]);
              if(this.partyList[i].pictures.length){
                this.pictures.push({name:this.partyList[i].name,id:this.partyList[i]._id,picture:this.partyList[i].pictures[0].picture});
              }else{
                this.pictures.push({name:this.partyList[i].name,id:this.partyList[i]._id,picture:"empty.png"});
              }
            }
          }
          this.isParties=true;
          this.pictures.forEach((picture)=>{
            console.log(picture);
          })
          console.log(this.pictures);
          console.log(this.api_url)
        }
        this.isLoading=true;
    });
  }

  nextParty(){
    this.pictures=[];
    switch (this.partyList.length)
    {
      case 1 :
      case 2 :
      case 3 :
        this.parties=[];
        this.parties.push(this.partyList[0]);
        if(this.partyList[0].pictures.length){
          this.pictures.push({name:this.partyList[0].name,id:this.partyList[0]._id,picture:this.partyList[0].pictures[0].picture});
        }else{
          this.pictures.push({name:this.partyList[0].name,id:this.partyList[0]._id,picture:"empty.png"});
        }
        for(let i=1; i<3; i++){
          if(i<this.partyList.length){
            this.parties.push(this.partyList[i]);
            if(this.partyList[i].pictures.length){
              this.pictures.push({name:this.partyList[i].name,id:this.partyList[i]._id,picture:this.partyList[i].pictures[0].picture});
            }else{
              this.pictures.push({name:this.partyList[i].name,id:this.partyList[i]._id,picture:"empty.png"});
            }
          }
        }
        break;
      default :
        this.counterParty = ((this.counterParty+1>=this.partyList.length)?0:this.counterParty+1);
        this.counterParty1=((this.counterParty1+1>=this.partyList.length)?0:this.counterParty1+1);
        this.counterParty2=((this.counterParty2+1>=this.partyList.length)?0:this.counterParty2+1);

        this.parties=[];
        this.parties.push(this.partyList[this.counterParty]);
        if(this.partyList[this.counterParty].pictures.length)
        {
          this.pictures.push({name:this.partyList[this.counterParty].name,id:this.partyList[this.counterParty]._id,picture:this.partyList[this.counterParty].pictures[0].picture});
        }else{
          this.pictures.push({name:this.partyList[this.counterParty].name,id:this.partyList[this.counterParty]._id,picture:"empty.png"});
        }

        this.parties.push(this.partyList[this.counterParty1]);
        if(this.partyList[this.counterParty1].pictures.length)
        {
          this.pictures.push({name:this.partyList[this.counterParty1].name,id:this.partyList[this.counterParty1]._id,picture:this.partyList[this.counterParty1].pictures[0].picture});
        }else{
          this.pictures.push({name:this.partyList[this.counterParty1].name,id:this.partyList[this.counterParty1]._id,picture:"empty.png"});
        }

        this.parties.push(this.partyList[this.counterParty2]);
        if(this.partyList[this.counterParty2].pictures.length)
        {
          this.pictures.push({name:this.partyList[this.counterParty2].name,id:this.partyList[this.counterParty2]._id,picture:this.partyList[this.counterParty2].pictures[0].picture});
        }else{
          this.pictures.push({name:this.partyList[this.counterParty2].name,id:this.partyList[this.counterParty2]._id,picture:"empty.png"});
        }
    }
  }

  previousParty(){
    this.pictures=[];
    switch (this.partyList.length)
    {
      case 1 :
      case 2 :
      case 3 :
        this.parties=[];
        this.parties.push(this.partyList[0]);
        if(this.partyList[0].pictures.length){
          this.pictures.push({name:this.partyList[0].name,id:this.partyList[0]._id,picture:this.partyList[0].pictures[0].picture});
        }else{
          this.pictures.push({name:this.partyList[0].name,id:this.partyList[0]._id,picture:"empty.png"});
        }
        for(let i=1; i<3; i++){
          if(i<this.partyList.length){
            this.parties.push(this.partyList[i]);
            if(this.partyList[i].pictures.length){
              this.pictures.push({name:this.partyList[i].name,id:this.partyList[i]._id,picture:this.partyList[i].pictures[0].picture});
            }else{
              this.pictures.push({name:this.partyList[i].name,id:this.partyList[i]._id,picture:"empty.png"});
            }
          }
        }
        break;
      default :
        this.counterParty = ((this.counterParty-1<0)?this.partyList.length-1:this.counterParty-1);
        this.counterParty1 = ((this.counterParty1-1<0)?this.partyList.length-1:this.counterParty1-1);
        this.counterParty2 = ((this.counterParty2-1<0)?this.partyList.length-1:this.counterParty2-1);

        this.parties=[];
        this.parties.push(this.partyList[this.counterParty]);
        if(this.partyList[this.counterParty].pictures.length)
        {
          this.pictures.push({name:this.partyList[this.counterParty].name,id:this.partyList[this.counterParty]._id,picture:this.partyList[this.counterParty].pictures[0].picture});
        }else{
          this.pictures.push({name:this.partyList[this.counterParty].name,id:this.partyList[this.counterParty]._id,picture:"empty.png"});
        }

        this.parties.push(this.partyList[this.counterParty1]);
        if(this.partyList[this.counterParty1].pictures.length)
        {
          this.pictures.push({name:this.partyList[this.counterParty1].name,id:this.partyList[this.counterParty1]._id,picture:this.partyList[this.counterParty1].pictures[0].picture});
        }else{
          this.pictures.push({name:this.partyList[this.counterParty1].name,id:this.partyList[this.counterParty1]._id,picture:"empty.png"});
        }

        this.parties.push(this.partyList[this.counterParty2]);
        if(this.partyList[this.counterParty2].pictures.length)
        {
          this.pictures.push({name:this.partyList[this.counterParty2].name,id:this.partyList[this.counterParty2]._id,picture:this.partyList[this.counterParty2].pictures[0].picture});
        }else{
          this.pictures.push({name:this.partyList[this.counterParty2].name,id:this.partyList[this.counterParty2]._id,picture:"empty.png"});
        }
    }
  }

  leaveParty(partyId){

    this.isLoading=false;
    this.partiesService.leavePartyParticipant(this.userId,partyId).subscribe((response)=>{
      console.log("party leave");
      this.partyLeft = response.party;
      console.log("this.partyLeft",this.partyLeft);
      let partyList = this.partyList.filter((party)=>{
        console.log("party",party);
        if(this.partyLeft._id!=party._id){
          return party;
        }
      });
      this.partyList = partyList;
      this.parties=[];
      this.pictures=[];
      if(this.partyList.length){
        this.parties.push(this.partyList[0]);
        if(this.partyList[0].pictures.length){
          this.pictures.push({name:this.partyList[0].name,id:this.partyList[0]._id,picture:this.partyList[0].pictures[0].picture});
        }else{
          this.pictures.push({name:this.partyList[0].name,id:this.partyList[0]._id,picture:"empty.png"});
        }

        for(let i=1; i<3; i++){
          if(i<this.partyList.length){
            this.parties.push(this.partyList[i]);
            if(this.partyList[i].pictures.length){
              this.pictures.push({name:this.partyList[i].name,id:this.partyList[i]._id,picture:this.partyList[i].pictures[0].picture});
            }else{
              this.pictures.push({name:this.partyList[i].name,id:this.partyList[i]._id,picture:"empty.png"});
            }
          }
        }
        this.isParties=true;
        this.pictures.forEach((picture)=>{
          console.log(picture);
        })
        console.log(this.pictures);
        console.log(this.api_url)
      }
      this.isLoading=true;
    })
  }

}
