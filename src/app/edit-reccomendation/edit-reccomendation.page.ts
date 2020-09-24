import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Router } from '@angular/router';
import { Location } from "@angular/common";

import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
declare var window: any; 


@Component({
  selector: 'app-edit-reccomendation',
  templateUrl: './edit-reccomendation.page.html',
  styleUrls: ['./edit-reccomendation.page.scss'],
})
export class EditReccomendationPage implements OnInit {
	
	private win: any = window;
	type: any = 'Photo';
	category: any = '';
	description: any;
	web_link: any = '';
	is_live_image_updated = false;
	live_image_url: any = '';
	imgBlob: any;
	live_file_name: any;
	image: any = '';
	errors = config.errors;
	IMAGES_URL = config.IMAGES_URL;
	expression: any;
	is_submit = false;
	post: any;
	categories: any;

 	constructor(public apiService: ApiserviceService, public router: Router, private camera: Camera, private file: File, private filePath: FilePath,  private transfer: FileTransfer, public location: Location, private globalFooService: GlobalFooService) { 
  		this.expression = /^\S*$/;
  	}

  	ngOnInit() {
  	}

  	dismiss(){
      this.location.back();
    }

  	ionViewDidEnter(){
  		this.getCategories();
  	}

  	getCategories(){

  		this.apiService.presentLoading();
  		var dict = {
	    	user_id: localStorage.getItem('userId')
	    }
	  
	    this.apiService.postData(dict,'categories').subscribe((result) => { 
	      this.apiService.stopLoading();  
	      if(result.status == 1){
	        this.categories = result.data;	        
	        this.getData();
	      }
	      else{
	        this.apiService.presentToast('Error while sending request,Please try after some time','success');
	      }
	    },
	    err => {
	        this.apiService.presentToast('Technical error,Please try after some time','success');
	    });
  	}

  	getData(){
      let dict = {
        'postId': localStorage.getItem('postId'),
        'user_id': localStorage.getItem('userId'),
      };

      this.apiService.presentLoading();
        this.apiService.postData(dict,'postDetail').subscribe((result) => {
          this.apiService.stopLoading();
          console.log(result)
          if(result.status == 1){
              this.post = result.data[0];
              this.type = result.data[0].type;
              this.category = result.data[0].category;
              this.description = result.data[0].description;
              this.web_link = result.data[0].web_link;
              this.image = result.data[0].image;
          }
          else{
              this.apiService.presentToast('Technical error,Please try after some time.','danger');
          }
        },
        err => {
          this.apiService.stopLoading();
            this.apiService.presentToast('Technical error,Please try after some time.','danger');
        });
    };


    add_recc(){

  		this.is_submit = true;
  		console.log(this.type, this.category, this.description,this.web_link);

  		if(this.errors.indexOf(this.category) >= 0){
	      return false;
	    }
  		if(this.errors.indexOf(this.description) >= 0){
	      return false;
	    }

	    if(this.type == 'Website'){
	    	if(this.errors.indexOf(this.web_link) >= 0 || !this.expression.test(this.web_link)){
		      return false;
		    }
	    }

	    if(this.type == 'Photo'){
	    	if(this.errors.indexOf(this.imgBlob) >= 0){
		      return false;
		    }
	    }
	    
	    
	    if(this.type == 'Photo' && this.errors.indexOf(this.live_image_url) == -1){
	    	this.uploadImage();
	    }else{
	    	this.profileImageSubmit();
	    }
  		
  	}


  	async selectImage() {
	    const actionSheet = await this.apiService.actionSheetController.create({
	      header: "Select Image",
	      buttons: [{
	            text: 'From Gallery',
	            handler: () => {
	                this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
	            }
	        },
	        {
	            text: 'Use Camera',
	            handler: () => {
	                this.takePicture(this.camera.PictureSourceType.CAMERA);
	            }
	        },
	        {
	            text: 'Cancel',
	            role: 'cancel'
	        }
	      ]
	    });
	    await actionSheet.present();
	  }



	takePicture(sourceType: PictureSourceType) {
	    
	    var options: CameraOptions = {
	        quality: 25,
	        sourceType: sourceType,
	        saveToPhotoAlbum: false,
	        correctOrientation: true,
	        allowEdit: true
	    };

	    this.camera.getPicture(options).then(imagePath => {
	      if (sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
	          this.is_live_image_updated = true;
	          this.live_image_url = imagePath;
	          this.filePath.resolveNativePath(imagePath)
	              .then(filePath => {
	                this.startUpload(imagePath);
	              });
	      } else {
	        this.is_live_image_updated = true;
	        this.startUpload(imagePath);
	      }
	    }, (err) => {
	     console.log('err')
	     console.log(err)
	    });
	};

	startUpload(imageData) {
	    this.file.resolveLocalFilesystemUrl(imageData).then(entry => {
	        ( < FileEntry > entry).file(file => {
	        this.readFile(file)
	        })
	    })
	    .catch(err => {
	        this.apiService.presentToast('Error while reading file.','danger');
	    });
	}

  	readFile(file: any) {
	    var self = this;
	    const reader = new FileReader();
	    reader.onloadend = () => {
	        const imgBlob = new Blob([reader.result], {
	            type: file.type
	        });
	        self.imgBlob = imgBlob;
	        self.live_file_name = file.name;
	        // self.uploadImage();
	    };
	    reader.readAsArrayBuffer(file);
  	};

  	uploadImage(){
  		const frmData = new FormData();
  		frmData.append('file', this.imgBlob, this.live_file_name);
  		this.apiService.postData(frmData,'uploadReccImage').subscribe((result) => { 
	      		console.log(result);
	      		this.image = result;
	      		this.profileImageSubmit();	      		
	     
	    },
	    err => {
	        this.apiService.presentToast('Technical error,Please try after some time','success');
	    });
  	}

  	profileImageSubmit(){
	    this.apiService.presentLoading();
	    var dict = {
	    	type: this.type,
	    	description: this.description,
	    	category: this.category,
	    	web_link: this.web_link,
	    	image: this.image,
	    	user_id: localStorage.getItem('userId'),
	    	_id: this.post._id
	    }
	  
	    this.apiService.postData(dict,'updateRecc').subscribe((result) => { 
	      this.apiService.stopLoading();  
	      if(result.status == 1){

	      	this.description = '';
	      	this.is_submit = false;
	      	this.live_image_url = '';
	      	this.imgBlob = '';
	      	this.live_file_name = '';
	      	this.type = 'Photo';
	      	this.category = 'netflix';
	      	this.web_link = '';
	      	this.globalFooService.publishSomeData({
            	foo: {'data': result.data, 'page': 'updateprofile'}
        	});
	        
	        this.apiService.presentToast(result.msg,'success');
	        this.router.navigate(['/tabs/home'])
	      }
	      else{
	        this.apiService.presentToast('Error while sending request,Please try after some time','success');
	      }
	    },
	    err => {
	        this.apiService.presentToast('Technical error,Please try after some time','success');
	    });
  	}

}
