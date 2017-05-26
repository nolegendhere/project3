import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-currentuser',
  templateUrl: './edit-currentuser.component.html',
  styleUrls: ['./edit-currentuser.component.css']
})
export class EditCurrentuserComponent implements OnInit {
  user:any;
  isLoading:boolean=false;

  genders = ['Boy','Girl'];
  genderPreferences = ['Boy','Girl'];
  paymentPreferences = ["Free","Paid"];
  paritiePreferences = ["equal","unchecked"];
  placeTypePreferences = ["appartment","house","local","openAir"];
  sizePreferences = ["small","average","big"];

  value1:number=20;
  value2:number=30;
  minValue1: number = 18;
  maxValue1: number = 65;
  minValue2: number = 18;
  maxValue2: number = 65;


  constructor(private router: Router,private route: ActivatedRoute,
  private usersService: UsersService) { }

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
    this.usersService.edit(myForm.value, this.user).subscribe(() => {
      this.router.navigate([`/profile/${this.user._id}/show`]);
    });;
  }

  remove(){
    this.usersService.remove(this.user._id).subscribe(() => {
      //TO-DO
      this.router.navigate(["/"]);
    });;
  }

  goBack(id){
    this.router.navigate([`/profile/${this.user._id}/show`]);
  }

  changeValue1(value: number) {
    console.log("this.value1",this.value1);
    console.log("this.value2",this.value2);
    if(this.value2<this.value1+4)
    {
      this.value1 = this.value2-1;
    }
  }

  changeValue2(value: number) {
    //this.maxValue1 = this.value2;
    console.log("this.value1",this.value1);
    console.log("this.value2",this.value2);
    if(this.value2<this.value1+4)
    {
      this.value2 = this.value1+1;
    }
  }

}
