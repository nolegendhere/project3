import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RouterModule } from "@angular/router";
import { routes } from './app.routing';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SessionService } from './services/session.service';
import { PartiesService } from './services/parties.service';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';


import { CollapseModule } from 'ngx-bootstrap';
import { PartiesSearchComponent } from './parties-search/parties-search.component';
import { ShowCurrentuserComponent } from './show-currentuser/show-currentuser.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    NavbarComponent,
    PartiesSearchComponent,
    ShowCurrentuserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    CollapseModule.forRoot()
  ],
  providers: [SessionService, PartiesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
