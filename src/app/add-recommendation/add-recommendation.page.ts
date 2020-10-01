import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Router } from '@angular/router';

import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';


declare var window: any; 

@Component({
  selector: 'app-add-recommendation',
  templateUrl: './add-recommendation.page.html',
  styleUrls: ['./add-recommendation.page.scss'],
})
export class AddRecommendationPage implements OnInit {
	
	private win: any = window;
	type: any = 'Photo';
	category: any = '';
	description: any = '';
	web_link: any = '';
	is_live_image_updated = false;
	live_image_url: any = '';
	imgBlob: any;
	live_file_name: any;
	image: any = '';
	errors = config.errors;
	expression: any;
	is_submit = false;
	categories: any;

  	constructor(public apiService: ApiserviceService, public router: Router, private camera: Camera, private file: File, private filePath: FilePath,  private transfer: FileTransfer, private globalFooService: GlobalFooService) { 
  		this.expression = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  	}

  	ngOnInit() {
  	}

  	ionViewDidEnter(){
  		this.getCategories();
  	}

  	typeChange(type){
  		if(type == 'Photo'){
  			this.web_link = '';
  		}else if(type == 'Website'){
  			this.live_image_url = '';
  			this.is_live_image_updated = false;
  			this.imgBlob = '';
  			this.live_file_name = '';
  		}else{
  			this.web_link = '';
  			this.live_image_url = '';
  			this.is_live_image_updated = false;
  			this.imgBlob = '';
  			this.live_file_name = '';
  		}
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
	        //this.category = this.categories[0]._id;
	      }
	      else{
	        this.apiService.presentToast('Error while sending request,Please try after some time','success');
	      }
	    },
	    err => {
	        this.apiService.presentToast('Technical error,Please try after some time','success');
	    });
  	}

  	add_recc(){

  		this.is_submit = true;
  		console.log(this.type, this.category, this.description,this.web_link);
  		if(this.errors.indexOf(this.category) >= 0){
	      return false;
	    }
  		if(this.type != 'Website'){
  			if(this.errors.indexOf(this.description) >= 0){
		      return false;
		    }
  		}
  		

	    if(this.type == 'Website'){
	    	if(this.errors.indexOf(this.web_link) >= 0 || !this.expression.test(this.web_link)){
		      return false;
		    }
	    }

	    if(this.type == 'Photo'){
	    	if(this.errors.indexOf(this.live_image_url) >= 0){
		      return false;
		    }
	    }
	    
	    
	    if(this.type == 'Photo'){
	    	this.uploadImage();
	    }else{
	    	this.profileImageSubmit();
	    }
  		
  	}


  	async selectImage() {
	    const actionSheet = await this.apiService.actionSheetController.create({
	      header: "Select Image source",
	      buttons: [{
	            text: 'Gallery',
	            handler: () => {
	                this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
	            }
	        },
	        {
	            text: 'Camera',
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
	        this.live_image_url = imagePath;
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
	    	add_user_type: 'user'
	    }
	  
	    this.apiService.postData(dict,'addRecc').subscribe((result) => { 
	      this.apiService.stopLoading();  
	      if(result.status == 1){

	      	this.description = '';
	      	this.is_submit = false;
	      	this.live_image_url = '';
	      	this.imgBlob = '';
	      	this.live_file_name = '';
	      	this.type = 'Photo';
	      	this.category = '';
	      	this.web_link = '';
	      	this.globalFooService.publishSomeData({
            	foo: {'data': '', 'page': 'updateprofile'}
        	});
        	this.is_live_image_updated = false;
	        this.image = '';
	        
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
