import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = {
    username: '',
    password: ''
  };

  error: string;

  constructor(
    private session: SessionService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login() {
    this.session.login(this.user).subscribe(result => {
      if (result === true) {
        // login successful
        this.router.navigate(['/partiesSearch']);
 			} else {
        // login failed
        this.error = 'Username or password is incorrect';
      }
    });
  }
}
