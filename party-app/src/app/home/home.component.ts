import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketsService }     from '../services/sockets.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router,private socketsService: SocketsService) { }

  ngOnInit() {
    //this.socketsService.connect();
  }

  signup() {
    this.router.navigate(['/signup']);
  }

  login() {
    this.router.navigate(['/login']);
  }
}
