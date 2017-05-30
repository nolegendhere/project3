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

  genderPreferences = ['Boy','Girl','BoysGirls'];
  paymentPreferences = ["Free","Paid"];
  parityPreferences = ["equal","unchecked"];
  placeTypePreferences = ["appartment","house","local","openAir","All"];
  sizePreferences = ["small","average","big","All"];

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
    myForm.value.gender = this.user.gender;
    myForm.value.age = this.user.age;
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
}
