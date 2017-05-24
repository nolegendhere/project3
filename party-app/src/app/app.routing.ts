import { Routes } from '@angular/router';
import { SessionService } from './services/session.service';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PartiesSearchComponent } from './parties-search/parties-search.component';
import { ShowCurrentuserComponent } from './show-currentuser/show-currentuser.component';
import { EditCurrentuserComponent } from './edit-currentuser/edit-currentuser.component';
import { PartySingleEditComponent } from './party-single-edit/party-single-edit.component';
import { PartyListCurrentuserComponent } from './party-list-currentuser/party-list-currentuser.component';
import { UsersSearchComponent } from './users-search/users-search.component';
import { NewPartyCurrentuserComponent } from './new-party-currentuser/new-party-currentuser.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'partiesSearch', component: PartiesSearchComponent, canActivate: [SessionService] },
    { path: 'profile/:id/show', component: ShowCurrentuserComponent, canActivate: [SessionService]},
    // { path: 'profile', component: ShowCurrentuserComponent, canActivate: [SessionService], children: [
    //   { path: 'parties/:id/edit', component: PartySingleEditComponent }
    // ] }
    { path: 'profile/:id/edit', component: EditCurrentuserComponent, canActivate: [SessionService]},
    { path: 'profile/parties/:id/edit', component: PartySingleEditComponent, canActivate: [SessionService]},
    { path: 'profile/:id/parties', component: PartyListCurrentuserComponent, canActivate: [SessionService]},
    { path: 'profile/:userId/parties/:partyId/usersSearch', component: UsersSearchComponent, canActivate: [SessionService]},
    { path: 'profile/:id/parties/new', component: NewPartyCurrentuserComponent, canActivate: [SessionService]},
    //{ path: '**', redirectTo: '' }

];
