import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

	newUser = {
    username: '',
    password: '',
    profile: {
      age: 30,
      gender: "Boy"
    }
  };

  user: any;
  error: string;

  minAgeLimit: number = 18;
  maxAgeLimit: number = 65;
  genders = ['Boy','Girl'];

  constructor(
  	private session: SessionService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  signup() {
  	this.session.signup(this.newUser)
      .subscribe(result => {
          if (result === true) {
              // login successful
              console.log('result ok', result);
              this.router.navigate(['/partiesSearch']);
          } else {
          		console.log('result ko', result);
              // login failed
              // this.error = 'Username or password is incorrect';
          }
      });
  }
}
