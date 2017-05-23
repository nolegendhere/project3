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
    password: ''
  };

  user: any;
  error: string;


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
              this.router.navigate(['/phone']);
          } else {
          		console.log('result ko', result);
              // login failed
              // this.error = 'Username or password is incorrect';
          }
      });
  }
}
