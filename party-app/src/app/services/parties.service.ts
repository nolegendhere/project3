import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { SessionService } from '../services/session.service';

@Injectable()
export class PartiesService {
  BASE_URL: string = 'http://localhost:3000';
  partyList:Array<any>=[];
  party:any;
  userId:any;
  constructor(private http: Http,private sessionService: SessionService) {
    // this.userId = this.sessionService.id;
    // console.log("this.user",this.userId);
  }

  getList() {
    let headers = new Headers({ 'Authorization': 'JWT ' + this.sessionService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.BASE_URL}/api/parties`, options)
      .map((res) =>{
        this.userId = this.sessionService.id;
        this.partyList=res.json();
        return res.json();
      });
  }

  get(id) {
    let headers = new Headers({ 'Authorization': 'JWT ' + this.sessionService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.BASE_URL}/api/parties/${id}`, options)
      .map((res) => res.json());
  }

  add(party) {
    console.log("add party",party);
    return this.http.post(`${this.BASE_URL}/api/paparty`,party).map((res) => res.json());
  }
}
