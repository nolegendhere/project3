import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartiesService } from '../services/parties.service';
import { UsersService } from '../services/users.service';
import { ImagesService } from '../services/images.service';
import { SessionService } from '../services/session.service';

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

  pictures:Array<any>=[];
  counterParty:number=0;
  counterParty1:number=1;
  counterParty2:number=2;

  constructor(private router: Router,private route: ActivatedRoute,private partiesService: PartiesService, private usersService: UsersService, private imagesService: ImagesService,private sessionService: SessionService) { }

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
      this.pictures=[];
      if(this.party.pictures.length){
        this.pictures.push({id:this.party.pictures[0]._id,picture:this.party.pictures[0].picture});
      }
      for(let i=1; i<3; i++){
        if(i<this.party.pictures.length){
          this.pictures.push({id:this.party.pictures[i]._id,picture:this.party.pictures[i].picture});
        }
      }
      // this.pictures.forEach((picture)=>{
      //   console.log(picture);
      // })
      // console.log(this.pictures);
      // console.log(this.api_url)
      this.isLoading=true;
    })
  }

  getUserDetails(id){
    this.isLoading=false;
    this.usersService.get(id).subscribe((userObs)=>{
      this.user = userObs;
      // console.log("this.user",this.user);
      this.pictures=[];
      if(this.user.profile.pictures.length){
        this.pictures.push({id:this.user.profile.pictures[0]._id,picture:this.user.profile.pictures[0].picture});
      }
      for(let i=1; i<3; i++){
        if(i<this.user.profile.pictures.length){
          this.pictures.push({id:this.user.profile.pictures[i]._id,picture:this.user.profile.pictures[i].picture});
        }
      }
      // this.pictures.forEach((picture)=>{
      //   console.log(picture);
      // })
      // console.log(this.pictures);
      // console.log(this.api_url)
      this.isLoading=true;
    })
  }

  nextPicture(){
    if(this.isParty){
      this.pictures=[];
      this.partiesService.get(this.party._id).subscribe((partyObs)=>{
        this.party = partyObs;
        this.user=this.party.owner;

        switch (this.party.pictures.length)
        {
          case 0:
            break;
          case 1 :
          case 2 :
          case 3 :
            this.pictures=[];
            this.pictures.push({id:this.party.pictures[0]._id,picture:this.party.pictures[0].picture});
            for(let i=1; i<3; i++){
              if(i<this.party.pictures.length){
                this.pictures.push({id:this.party.pictures[i]._id,picture:this.party.pictures[i].picture});
              }
            }
            break;
          default :
            this.counterParty = ((this.counterParty+1>=this.party.pictures.length)?0:this.counterParty+1);
            this.counterParty1=((this.counterParty1+1>=this.party.pictures.length)?0:this.counterParty1+1);
            this.counterParty2=((this.counterParty2+1>=this.party.pictures.length)?0:this.counterParty2+1);

            this.pictures.push({id:this.party.pictures[this.counterParty]._id,picture:this.party.pictures[this.counterParty].picture});

            this.pictures.push({id:this.party.pictures[this.counterParty1]._id,picture:this.party.pictures[this.counterParty1].picture});

            this.pictures.push({id:this.party.pictures[this.counterParty2]._id,picture:this.party.pictures[this.counterParty2].picture});
        }

      });
    }else if(this.isUser){
      this.pictures=[];
      this.usersService.get(this.user._id).subscribe((userObs)=>{
        this.user = userObs;
        switch (this.user.profile.pictures.length)
        {
          case 0:
            break;
          case 1 :
          case 2 :
          case 3 :
            this.pictures=[];
            this.pictures.push({id:this.user.profile.pictures[0]._id,picture:this.user.profile.pictures[0].picture});
            for(let i=1; i<3; i++){
              if(i<this.user.profile.pictures.length){
                this.pictures.push({id:this.user.profile.pictures[i]._id,picture:this.user.profile.pictures[i].picture});
              }
            }
            break;
          default :
            this.counterParty = ((this.counterParty+1>=this.user.profile.pictures.length)?0:this.counterParty+1);
            this.counterParty1=((this.counterParty1+1>=this.user.profile.pictures.length)?0:this.counterParty1+1);
            this.counterParty2=((this.counterParty2+1>=this.user.profile.pictures.length)?0:this.counterParty2+1);

            this.pictures.push({id:this.user.profile.pictures[this.counterParty]._id,picture:this.user.profile.pictures[this.counterParty].picture});

            this.pictures.push({id:this.user.profile.pictures[this.counterParty1]._id,picture:this.user.profile.pictures[this.counterParty1].picture});

            this.pictures.push({id:this.user.profile.pictures[this.counterParty2]._id,picture:this.user.profile.pictures[this.counterParty2].picture});
        }
      });
    }
  }

  previousPicture(){
    if(this.isParty){
      this.partiesService.get(this.party._id).subscribe((partyObs)=>{
        this.party = partyObs;
        this.user=this.party.owner;

        this.pictures=[];
        switch (this.party.pictures.length)
        {
          case 0:
            break;
          case 1 :
          case 2 :
          case 3 :
            this.pictures=[];
            this.pictures.push({id:this.party.pictures[0]._id,picture:this.party.pictures[0].picture});
            for(let i=1; i<3; i++){
              if(i<this.party.pictures.length){
                this.pictures.push({id:this.party.pictures[i]._id,picture:this.party.pictures[i].picture});
              }
            }
            break;
          default :
            this.counterParty = ((this.counterParty-1<0)?this.party.pictures.length-1:this.counterParty-1);
            this.counterParty1 = ((this.counterParty1-1<0)?this.party.pictures.length-1:this.counterParty1-1);
            this.counterParty2 = ((this.counterParty2-1<0)?this.party.pictures.length-1:this.counterParty2-1);

            this.pictures.push({id:this.party.pictures[this.counterParty]._id,picture:this.party.pictures[this.counterParty].picture});

            this.pictures.push({id:this.party.pictures[this.counterParty1]._id,picture:this.party.pictures[this.counterParty1].picture});

            this.pictures.push({id:this.party.pictures[this.counterParty2]._id,picture:this.party.pictures[this.counterParty2].picture});
        }
      });
    }else if(this.isUser){
      this.pictures=[];
      this.usersService.get(this.user._id).subscribe((userObs)=>{
        this.user = userObs;
        console.log("this.user.profile.pictures.length",this.user.profile.pictures.length);
        switch (this.user.profile.pictures.length)
        {
          case 0:
            break;
          case 1 :
          case 2 :
          case 3 :
            this.pictures=[];
            this.pictures.push({id:this.user.profile.pictures[0]._id,picture:this.user.profile.pictures[0].picture});
            for(let i=1; i<3; i++){
              if(i<this.user.profile.pictures.length){
                this.pictures.push({id:this.user.profile.pictures[i]._id,picture:this.user.profile.pictures[i].picture});
              }
            }
            break;
          default :
            this.counterParty = ((this.counterParty-1<0)?this.user.profile.pictures.length-1:this.counterParty-1);
            this.counterParty1 = ((this.counterParty1-1<0)?this.user.profile.pictures.length-1:this.counterParty1-1);
            this.counterParty2 = ((this.counterParty2-1<0)?this.user.profile.pictures.length-1:this.counterParty2-1);

            this.pictures.push({id:this.user.profile.pictures[this.counterParty]._id,picture:this.user.profile.pictures[this.counterParty].picture});

            this.pictures.push({id:this.user.profile.pictures[this.counterParty1]._id,picture:this.user.profile.pictures[this.counterParty1].picture});

            this.pictures.push({id:this.user.profile.pictures[this.counterParty2]._id,picture:this.user.profile.pictures[this.counterParty2].picture});
        }
      });
    }
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
        // this.imagesService.upload(this.imagesService.BASE_URL+"/api/images/upload-image/"+response.image._id,[],this.filesToUpload).subscribe((result)=>{
        //     this.resultUpload=result;
        //     this.image.picture=this.resultUpload.filename;
        //     this.getUserDetails(this.user._id);
        // })

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
    // let obj =  "JWT " + this.sessionService.token;
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
      // xhr.setRequestHeader("Authorization", obj);
      //formData.append()
      xhr.send(formData);
    });
  }

  deleteImage(id){
    if(this.isParty){
      console.log("entra");
      this.imagesService.deleteImage(id).subscribe((response)=>{
        if(!response.image){
          console.log("response",response);
          alert("error en el servidor")
        }
        this.getPartyDetails(this.party._id);
      });
    }else if(this.isUser){
      console.log("entra");
      this.imagesService.deleteImage(id).subscribe((response)=>{
        if(!response.image){
          alert("error en el servidor")
        }
        this.getUserDetails(this.user._id);
      });
    }
  }
}
