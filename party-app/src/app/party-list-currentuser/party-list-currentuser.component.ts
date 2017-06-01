import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/users.service';
import { ImagesService } from '../services/images.service';

@Component({
  selector: 'app-party-list-currentuser',
  templateUrl: './party-list-currentuser.component.html',
  styleUrls: ['./party-list-currentuser.component.css']
})
export class PartyListCurrentuserComponent implements OnInit {
  partyList:Array<any>=[];
  user:any;
  isLoading:boolean=false;
  api_url:string;
  counterParty:number=0;
  counterParty1:number=1;
  counterParty2:number=2;
  parties:Array<any>=[];
  isParties:boolean=false;
  pictures:Array<any>=[];

  constructor(private route: ActivatedRoute,private router: Router,private usersService: UsersService,private imagesService: ImagesService) { }

  ngOnInit() {
    this.api_url = this.imagesService.getApiUrl('get-image/')
    this.route.params.subscribe(params=>{
      this.getUserDetails(params['id']);
      console.log("params['id']",params['id']);
    })
  }

  getUserDetails(id) {
    this.usersService.get(id).subscribe((userObs) => {
        this.user = userObs;
        if(this.user.partiesOwned.length){
          this.parties.push(this.user.partiesOwned[0]);
          this.pictures.push({name:this.user.partiesOwned[0].name,id:this.user.partiesOwned[0]._id,picture:this.user.partiesOwned[0].pictures[0].picture});
          for(let i=1; i<3; i++){
            if(i<this.user.partiesOwned.length){
              this.parties.push(this.user.partiesOwned[i]);
              if(this.user.partiesOwned[i].pictures.length){
                this.pictures.push({name:this.user.partiesOwned[i].name,id:this.user.partiesOwned[i]._id,picture:this.user.partiesOwned[i].pictures[0].picture});
              }else{
                this.pictures.push({name:this.user.partiesOwned[i].name,id:this.user.partiesOwned[i]._id,picture:"empty.png"});
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
    switch (this.user.partiesOwned.length)
    {
      case 1 :
      case 2 :
      case 3 :
        this.parties=[];
        this.parties.push(this.user.partiesOwned[0]);
        this.pictures.push({name:this.user.partiesOwned[0].name,id:this.user.partiesOwned[0]._id,picture:this.user.partiesOwned[0].pictures[0].picture});
        for(let i=1; i<3; i++){
          if(i<this.user.partiesOwned.length){
            this.parties.push(this.user.partiesOwned[i]);
            if(this.user.partiesOwned[i].pictures.length){
              this.pictures.push({name:this.user.partiesOwned[i].name,id:this.user.partiesOwned[i]._id,picture:this.user.partiesOwned[i].pictures[0].picture});
            }else{
              this.pictures.push({name:this.user.partiesOwned[i].name,id:this.user.partiesOwned[i]._id,picture:"empty.png"});
            }
          }
        }
        break;
      default :
        this.counterParty = ((this.counterParty+1>=this.user.partiesOwned.length)?0:this.counterParty+1);
        this.counterParty1=((this.counterParty1+1>=this.user.partiesOwned.length)?0:this.counterParty1+1);
        this.counterParty2=((this.counterParty2+1>=this.user.partiesOwned.length)?0:this.counterParty2+1);

        this.parties=[];
        this.parties.push(this.user.partiesOwned[this.counterParty]);
        if(this.user.partiesOwned[this.counterParty].pictures.length)
        {
          this.pictures.push({name:this.user.partiesOwned[this.counterParty].name,id:this.user.partiesOwned[this.counterParty]._id,picture:this.user.partiesOwned[this.counterParty].pictures[0].picture});
        }else{
          this.pictures.push({name:this.user.partiesOwned[this.counterParty].name,id:this.user.partiesOwned[this.counterParty]._id,picture:"empty.png"});
        }

        this.parties.push(this.user.partiesOwned[this.counterParty1]);
        if(this.user.partiesOwned[this.counterParty1].pictures.length)
        {
          this.pictures.push({name:this.user.partiesOwned[this.counterParty1].name,id:this.user.partiesOwned[this.counterParty1]._id,picture:this.user.partiesOwned[this.counterParty1].pictures[0].picture});
        }else{
          this.pictures.push({name:this.user.partiesOwned[this.counterParty1].name,id:this.user.partiesOwned[this.counterParty1]._id,picture:"empty.png"});
        }

        this.parties.push(this.user.partiesOwned[this.counterParty2]);
        if(this.user.partiesOwned[this.counterParty2].pictures.length)
        {
          this.pictures.push({name:this.user.partiesOwned[this.counterParty2].name,id:this.user.partiesOwned[this.counterParty2]._id,picture:this.user.partiesOwned[this.counterParty2].pictures[0].picture});
        }else{
          this.pictures.push({name:this.user.partiesOwned[this.counterParty2].name,id:this.user.partiesOwned[this.counterParty2]._id,picture:"empty.png"});
        }
    }

  }

  previousParty(){
    this.pictures=[];
    switch (this.user.partiesOwned.length)
    {
      case 1 :
      case 2 :
      case 3 :
        this.parties=[];
        this.parties.push(this.user.partiesOwned[0]);
        this.pictures.push({name:this.user.partiesOwned[0].name,id:this.user.partiesOwned[0]._id,picture:this.user.partiesOwned[0].pictures[0].picture});
        for(let i=1; i<3; i++){
          if(i<this.user.partiesOwned.length){
            this.parties.push(this.user.partiesOwned[i]);
            if(this.user.partiesOwned[i].pictures.length){
              this.pictures.push({name:this.user.partiesOwned[i].name,id:this.user.partiesOwned[i]._id,picture:this.user.partiesOwned[i].pictures[0].picture});
            }else{
              this.pictures.push({name:this.user.partiesOwned[i].name,id:this.user.partiesOwned[i]._id,picture:"empty.png"});
            }
          }
        }
        break;
      default :
        this.counterParty = ((this.counterParty-1<0)?this.user.partiesOwned.length-1:this.counterParty-1);
        this.counterParty1 = ((this.counterParty1-1<0)?this.user.partiesOwned.length-1:this.counterParty1-1);
        this.counterParty2 = ((this.counterParty2-1<0)?this.user.partiesOwned.length-1:this.counterParty2-1);

        this.parties=[];
        this.parties.push(this.user.partiesOwned[this.counterParty]);
        if(this.user.partiesOwned[this.counterParty].pictures.length)
        {
          this.pictures.push({name:this.user.partiesOwned[this.counterParty].name,id:this.user.partiesOwned[this.counterParty]._id,picture:this.user.partiesOwned[this.counterParty].pictures[0].picture});
        }else{
          this.pictures.push({name:this.user.partiesOwned[this.counterParty].name,id:this.user.partiesOwned[this.counterParty]._id,picture:"empty.png"});
        }

        this.parties.push(this.user.partiesOwned[this.counterParty1]);
        if(this.user.partiesOwned[this.counterParty1].pictures.length)
        {
          this.pictures.push({name:this.user.partiesOwned[this.counterParty1].name,id:this.user.partiesOwned[this.counterParty1]._id,picture:this.user.partiesOwned[this.counterParty1].pictures[0].picture});
        }else{
          this.pictures.push({name:this.user.partiesOwned[this.counterParty1].name,id:this.user.partiesOwned[this.counterParty1]._id,picture:"empty.png"});
        }

        this.parties.push(this.user.partiesOwned[this.counterParty2]);
        if(this.user.partiesOwned[this.counterParty2].pictures.length)
        {
          this.pictures.push({name:this.user.partiesOwned[this.counterParty2].name,id:this.user.partiesOwned[this.counterParty2]._id,picture:this.user.partiesOwned[this.counterParty2].pictures[0].picture});
        }else{
          this.pictures.push({name:this.user.partiesOwned[this.counterParty2].name,id:this.user.partiesOwned[this.counterParty2]._id,picture:"empty.png"});
        }
    }
  }

  seePartyCandidates(partyId){
    // console.log("hi userId "+userId)
    console.log("///////////////////////////////////")
    console.log("hi partyId "+partyId)
    this.router.navigate([`/profile/${this.user._id}/parties/${partyId}/usersSearch`]);
  }

  showParty(partyId){
    this.router.navigate([`/profile/${this.user._id}/parties/${partyId}/show`]);
  }

  newParty(id){
    this.router.navigate([`/profile/${id}/parties/new`]);
  }
}
