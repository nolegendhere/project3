import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PartiesService {
  BASE_URL: string = 'http://localhost:3000';
  partiesList:Array<any>=[];
  party:any;
  constructor(private http: Http) { }

  getList() {
    console.log("hi");
   return this.http.get(`${this.BASE_URL}/api/parties`)
     .map((res) =>{
       this.partiesList=res.json();
       return res.json();
     });
  }
}
