import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { SessionService } from '../services/session.service';

@Injectable()
export class ConversationsService {
  BASE_URL: string = 'http://localhost:3000';
  conversationList:Array<any>=[];
  conversation:any;
  constructor(private http: Http,private sessionService: SessionService) { }

  getList(id) {

    let headers = new Headers({ 'Authorization': 'JWT ' + this.sessionService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.BASE_URL}/api/conversations/?userId=${id}`, options).map((res) =>{
      this.conversationList = res.json();
      return res.json();
    });
  }

  get(id){
    let headers= new Headers({'Authorization':'JW'+this.sessionService.token});
    let options = new RequestOptions({headers:headers});
    return this.http.get(`${this.BASE_URL}/api/conversations/${id}`,options).map((res)=>{
      this.conversation = res.json();
      return res.json();
    })
  }

}
