import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartiesService } from '../services/parties.service';
import { UsersService } from '../services/users.service';
import { ImagesService } from '../services/images.service';

import { Image } from '../image/image.component';


@Component({
  selector: 'app-manipulate-images',
  templateUrl: './manipulate-images.component.html',
  styleUrls: ['./manipulate-images.component.css']
})
export class ManipulateImagesComponent implements OnInit {
  isLoading:boolean=false;
  isParty:boolean=false;
  isUser:boolean=false;
  isFilesGood:boolean=false;
  userId:any;
  user:any;
  party:any;
  image:any;
  api_url:string;

  constructor(private router: Router,private route: ActivatedRoute,private partiesService: PartiesService, private usersService: UsersService, private imagesService: ImagesService) { }

  ngOnInit() {
    this.image = new Image("","","");
    this.api_url = this.imagesService.getApiUrl('get-image/')
    this.route.params.subscribe((params)=>{
      if(params['partyId']){
        this.isParty=true;
        this.userId=params['userId'];
        this.getPartyDetails(params['partyId']);
      }
      else{
        this.isUser=true;
        this.getUserDetails(params['userId']);
      }
    })
  }

  getPartyDetails(id){
    this.isLoading=false;
    this.partiesService.get(id).subscribe((partyObs)=>{
      this.party = partyObs;
      this.user=this.party.owner;
      this.isLoading=true;
    })
  }

  getUserDetails(id){
    this.isLoading=false;
    this.usersService.get(id).subscribe((userObs)=>{
      this.user = userObs;
      this.isLoading=true;
    })
  }

  onSubmit(){

    if(this.isParty){
      this.image.party = this.party._id;
      this.imagesService.addImage(this.image).subscribe((response)=>{
        this.makeFileRequest(this.imagesService.BASE_URL+"/api/images/upload-image/"+response.image._id,[],this.filesToUpload).then((result)=>{
          // this.resultUpload=result;
          // this.image.picture=this.resultUpload.filename;
          this.getPartyDetails(this.party._id);
        },
        (error)=>{
          console.log(error);
        });
      });
    }else if(this.isUser){
      this.image.user = this.user._id;
      this.imagesService.addImage(this.image).subscribe((response)=>{
        this.makeFileRequest(this.imagesService.BASE_URL+"/api/images/upload-image/"+response.image._id,[],this.filesToUpload).then((result)=>{
          // this.resultUpload=result;
          // this.image.picture=this.resultUpload.filename;
          this.getUserDetails(this.user._id);
        },
        (error)=>{
          console.log(error);
        });
      });
    }
  }

  public resultUpload;
  public filesToUpload: Array<File>;

  fileChangeEvent(fileInput:any){
    this.filesToUpload=<Array<File>>fileInput.target.files;
    let isGood = true;
    for(var i=0;i<this.filesToUpload.length;i++){
      console.log("files",this.filesToUpload[i].name);
      if (!this.filesToUpload[i].name.match(/\.(jpeg|jpg|png)$/)){
        isGood=false;
      }
    }
    this.isFilesGood=isGood;
  }

  makeFileRequest(url:string,params:Array<string>,files:Array<File>){
    return new Promise(function(resolve,reject){
      var formData:any=new FormData();
      var xhr = new XMLHttpRequest();

      for(var i=0;i<files.length;i++){
        formData.append('image',files[i],files[i].name);
      }

      xhr.onreadystatechange=function(){
        if(xhr.readyState==4){
          if(xhr.status==200){
            resolve(JSON.parse(xhr.response));
          }else{
            reject(xhr.response);
          }

        }
      }
      xhr.open('POST',url,true);
      xhr.send(formData);
    });
  }

  goBack(){
    this.router.navigate([`profile/${this.user._id}/show`]);
  }
}
