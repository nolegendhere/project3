import { BrowserModule }    from '@angular/platform-browser';
import { NgModule }         from '@angular/core';
import { FormsModule }      from '@angular/forms';
import { HttpModule }       from '@angular/http';

import { RouterModule }     from "@angular/router";
import { routes }           from './app.routing';

import { CollapseModule } from 'ngx-bootstrap';

import { AppComponent }     from './app.component';

import { SessionService }   from './services/session.service';
import { PartiesService }   from './services/parties.service';
import { UsersService }     from './services/users.service';

import { LoginComponent }   from './login/login.component';
import { SignupComponent }  from './signup/signup.component';
import { HomeComponent }    from './home/home.component';
import { NavbarComponent }  from './navbar/navbar.component';
import { PartiesSearchComponent } from './parties-search/parties-search.component';
import { ShowCurrentuserComponent } from './show-currentuser/show-currentuser.component';
import { PartySingleEditComponent } from './party-single-edit/party-single-edit.component';
import { EditCurrentuserComponent } from './edit-currentuser/edit-currentuser.component';
import { PartyListCurrentuserComponent } from './party-list-currentuser/party-list-currentuser.component';
import { UsersSearchComponent } from './users-search/users-search.component';
import { NewPartyCurrentuserComponent } from './new-party-currentuser/new-party-currentuser.component';
import { PartyJoinedCurrentuserComponent } from './party-joined-currentuser/party-joined-currentuser.component';
import { ShowPartyJoinedCurrentuserComponent } from './show-party-joined-currentuser/show-party-joined-currentuser.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    NavbarComponent,
    PartiesSearchComponent,
    ShowCurrentuserComponent,
    PartySingleEditComponent,
    EditCurrentuserComponent,
    PartyListCurrentuserComponent,
    UsersSearchComponent,
    NewPartyCurrentuserComponent,
    PartyJoinedCurrentuserComponent,
    ShowPartyJoinedCurrentuserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    CollapseModule.forRoot()
  ],
  providers: [SessionService, PartiesService, UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
