import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/users.service';
import { PartiesService } from '../services/parties.service';

@Component({
  selector: 'app-users-search',
  templateUrl: './users-search.component.html',
  styleUrls: ['./users-search.component.css']
})
export class UsersSearchComponent implements OnInit {
  userList:Array<any>=[];
  isUsers:boolean=false;
  isLoading:boolean=false;
  party: any;
  userId: any;
  user: any;
  counter:number=0;
  constructor(private route: ActivatedRoute,private router: Router,private usersService: UsersService,private partiesService: PartiesService) { }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      console.log("params['partyId']",params['partyId']);
      this.userId=params['userId'];
      this.getUserDetails(params['partyId']);
    })
  }

  getUserDetails(partyId) {
    console.log(" partyId " +partyId);
    this.usersService.getList(partyId).subscribe((usersObs) => {
        // this.userList = usersObs;
        this.partiesService.get(partyId).subscribe((partyObs) => {
          this.party = partyObs;
          if(usersObs.length){
            this.userList = usersObs.filter((user)=>{
              let isValid:boolean=true;

              if(user.profile.age > this.party.ageRange.maxAge || user.profile.age < this.party.ageRange.minAge ){
                isValid=false;
              }

              if(user.profile.gender !== this.party.gender && this.party.gender!=="BoysGirls"){
                isValid=false;
              }

              if(user.partyPreferences.gender !== this.party.gender){
                isValid=false;
              }

              if(this.party.numOfPeople.numJoined>=this.party.numOfPeople.maxPeople){
                isValid=false;
              }

              if(user.partyPreferences.payment !== this.party.payment){
                isValid=false;
              }

              if(user.partyPreferences.parity !== this.party.parity){
                isValid=false;
              }

              if(user.partyPreferences.placeType !== this.party.placeType && user.partyPreferences.placeType!=="All"){
                isValid=false;
              }

              if(user.partyPreferences.size !== this.party.size && user.partyPreferences.size!=="All"){
                isValid=false;
              }

              if(isValid){
                return user;
              }
            });
            if(this.userList.length){
              this.user= this.userList[0];
              this.isUsers = true;
            }
          }
          this.isLoading=true;
        });
    });
  }

  joinParty(){
    if(this.party.candidates.length){
      let exists = this.party.candidates.filter((candidate)=>{
        if(String(candidate) == String(this.user)){
          console.log("this candidate exists")
          return candidate;
        }
      });
      if(exists.length){
        console.log("exists");
        this.isUsers = false;
        this.partiesService.addPartyParticipant(this.user._id,this.party._id).subscribe((partiesObs)=>{
          this.counter++;
          if(this.counter<this.userList.length){
            this.user = this.userList[this.counter];
            this.isUsers = true;
          }
          console.log("party Participant");
        })
      }
      else{
        this.partiesService.addPartyCandidate(this.user._id,this.party._id).subscribe((partiesObs)=>{
          this.counter++;
          if(this.counter<this.userList.length){
            this.user = this.userList[this.counter];
            this.isUsers = true;
          }
          console.log("party Candidated, already candidates");
        })
      }
    }
    else{
      this.partiesService.addPartyCandidate(this.user._id,this.party._id).subscribe((partiesObs)=>{
        this.counter++;
        if(this.counter<this.userList.length){
          this.user = this.userList[this.counter];
          this.isUsers = true;
        }
        console.log("party Candidated, without candidates");
      })
    }
  }

  notJoinParty(){
    this.isUsers = false;
    this.partiesService.addPartyPartiesSeen(this.user._id,this.party._id).subscribe((partiesObs)=>{
      this.counter++;
      if(this.counter<this.userList.length){
        this.user = this.userList[this.counter];
        this.isUsers = true;
      }
      console.log("party Participant");
    })
  }

  showParty(){
    this.router.navigate([`/profile/${this.userId}/parties/${this.party._id}/show`]);
  }

  goToPartiesOwned(){
    this.router.navigate([`/profile/${this.userId}/parties`]);
  }

}
