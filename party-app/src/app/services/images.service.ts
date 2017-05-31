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

  getImage(id){

  }

  getImageFilename(filename){

  }

  deleteImage(id){

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

}
