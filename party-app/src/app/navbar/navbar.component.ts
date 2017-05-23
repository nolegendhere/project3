import { Component, OnInit, NgZone } from '@angular/core';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isCollapsed:boolean = false;
  constructor(
  	private session: SessionService,
  	private router:  Router, ngZone:NgZone
  ) {}

  ngOnInit() {
  }

  logout() {
  	this.session.logout();
  	// this.router.navigate(['/login']);
  }
}
