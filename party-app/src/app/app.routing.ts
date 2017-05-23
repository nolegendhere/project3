import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PartiesSearchComponent } from './parties-search/parties-search.component';
import { ShowCurrentuserComponent } from './show-currentuser/show-currentuser.component';
import { HomeComponent } from './home/home.component';
import { SessionService } from './services/session.service';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'partiesSearch', component: PartiesSearchComponent, canActivate: [SessionService] },
    { path: 'profile/show', component: ShowCurrentuserComponent, canActivate: [SessionService] },
    { path: '**', redirectTo: '' }
];
