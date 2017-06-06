import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { SessionService } from '../services/session.service';

@Injectable()
export class UsersService {
  BASE_URL: string = 'http://localhost:3000';
  userList:Array<any>=[];
  userId:any;
  user:any;
  constructor(private http: Http,private sessionService: SessionService) {
    this.userId = this.sessionService.id;
    console.log("this.user",this.userId);
  }

  getList(partyId) {

    let headers = new Headers({ 'Authorization': 'JWT ' + this.sessionService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.BASE_URL}/api/users/?partyId=${partyId}`, options).map((res) =>{
      this.userList = res.json();
      return res.json();
    });
  }

  get(id) {
    let headers = new Headers({ 'Authorization': 'JWT ' + this.sessionService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.BASE_URL}/api/users/${id}`, options).map((res) =>{
        this.user = res.json();
        return res.json();
      });
  }


  edit(user,id) {
    let headers = new Headers({ 'Authorization': 'JWT ' + this.sessionService.token });
    let options = new RequestOptions({ headers: headers });
    console.log("edit user",user);
    return this.http.put(`${this.BASE_URL}/api/users/${id}/edit`,user, options).map((res) => res.json());
  }

  remove(id) {
    let headers = new Headers({ 'Authorization': 'JWT ' + this.sessionService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.delete(`${this.BASE_URL}/api/users/${id}/delete`, options)
      .map((res) => res.json());
  }

  addPartyCandidate(userId,partyId){
    let headers = new Headers({ 'Authorization': 'JWT ' + this.sessionService.token });
    let options = new RequestOptions({ headers: headers });
    let party = {
      id: partyId
    }
    console.log("party",party);
    return this.http.put(`${this.BASE_URL}/api/users/${userId}/candidates/new`, party, options).map((res) => res.json());
  }

  addPartyParticipant(userId,ownerId,partyId,room){
    let headers = new Headers({ 'Authorization': 'JWT ' + this.sessionService.token });
    let options = new RequestOptions({ headers: headers });
    let party = {
      id: partyId,
      ownerId: ownerId,
      room: room
    }
    console.log("party",party);
    return this.http.put(`${this.BASE_URL}/api/users/${userId}/participants/new`, party, options).map((res) => res.json());
  }

  addPartyUsersSeen(userId,partyId){
    let headers = new Headers({ 'Authorization': 'JWT ' + this.sessionService.token });
    let options = new RequestOptions({ headers: headers });
    let party = {
      id: partyId
    }
    console.log("party",party);
    return this.http.put(`${this.BASE_URL}/api/users/${userId}/usersSeen/new`, party, options).map((res) => res.json());
  }
}
