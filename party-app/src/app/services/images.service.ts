import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { SessionService } from '../services/session.service';

import { Image } from '../image/image.component';

@Injectable()
export class ImagesService {
  BASE_URL: string = 'http://localhost:3000';
  image:any;
  imageList:Array<any>;
  constructor(private http: Http,private sessionService: SessionService) {

  }

  deleteImage(id){
    console.log("entra service");
    let headers = new Headers({ 'Authorization': 'JWT ' + this.sessionService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.delete(`${this.BASE_URL}/api/images/${id}`,options).map((res) => res.json());
  }

  getApiUrl(segment=''):string{
    let url = this.BASE_URL+"/api/images/" +segment
    return url;
  }

  addImage(image: Image){
    let headers = new Headers({ 'Authorization': 'JWT ' + this.sessionService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(`${this.BASE_URL}/api/images/`, image, options).map((res) => res.json());
  }

  // upload(url:string,params:Array<string>,files:Array<File>){
  //   let headers = new Headers();
  //   headers.append('Access-Control-Allow-Origin', '*');
  //   let token = localStorage.getItem('token');
  //   headers.append("Content-Type", 'multipart/form-data');
  //   headers.append("auth", "JWT " + token);
  //   // let options = new RequestOptions({ headers: headers });
  //   var formData:any=new FormData();
  //   for(var i=0;i<files.length;i++){
  //     formData.append('image',files[i],files[i].name);
  //   }
  //   return this.http.post(url, formData,{headers: headers} /*options*/).map((res) => res.json());
  // }

}
