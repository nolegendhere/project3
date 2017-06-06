import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';
import { SocketsService } from '../services/sockets.service'

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

  constructor(private session: SessionService,private router: Router,private socketsService: SocketsService
  ) { }

  ngOnInit() {
  }

  login() {
    this.session.login(this.user).subscribe(result => {
      if (result === true) {
        // login successful
        this.socketsService.connect();
        this.router.navigate(['/partiesSearch']);
 			} else {
        // login failed
        this.error = 'Username or password is incorrect';
      }
    });
  }
}
