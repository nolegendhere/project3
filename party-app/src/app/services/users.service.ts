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

  get(id) {
    let headers = new Headers({ 'Authorization': 'JWT ' + this.sessionService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.BASE_URL}/api/users/${id}`, options).map((res) =>{
        this.user = res.json();
        return res.json();
      });
  }

  getList(userId,partyId) {

    let headers = new Headers({ 'Authorization': 'JWT ' + this.sessionService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.BASE_URL}/api/users/?userId=${userId}&&partyId=${partyId}`, options).map((res) =>{
      this.userList = res.json();
      return res.json();
    });
  }

  // getList() {
  //
  //   let headers = new Headers({ 'Authorization': 'JWT ' + this.SessionService.token });
  //   let options = new RequestOptions({ headers: headers });
  //   return this.http.get(`${this.BASE_URL}/phones`, options)
  //     .map((res) => res.json());
  // }
  //
  // get(id) {
  //   let headers = new Headers({ 'Authorization': 'JWT ' + this.SessionService.token });
  //   let options = new RequestOptions({ headers: headers });
  //   return this.http.get(`${this.BASE_URL}/phones/${id}`, options)
  //     .map((res) => res.json());
  // }
  //
  // edit(phone) {
  //   let headers = new Headers({ 'Authorization': 'JWT ' + this.SessionService.token });
  //   let options = new RequestOptions({ headers: headers });
  //   return this.http.put(`${this.BASE_URL}/phones/${phone.id}`, phone, options )
  //     .map((res) => res.json());
  // }
  //
  // remove(id) {
  //   let headers = new Headers({ 'Authorization': 'JWT ' + this.SessionService.token });
  //   let options = new RequestOptions({ headers: headers });
  //   return this.http.delete(`${this.BASE_URL}/phones/${id}`, options)
  //     .map((res) => res.json());
  // }

}
