import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { SessionService } from './services/session.service';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    // { path: 'add', component: AddPhoneComponent, canActivate: [SessionService] },
    // { path: 'addlist', component: AddListComponent, canActivate: [SessionService] },
    // { path: 'phone', component: PhoneListComponent, canActivate: [SessionService] },
    // { path: 'phone/:id', component: PhoneDetailsComponent, canActivate: [SessionService] },
    { path: '**', redirectTo: '' }
];
