import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Router } from '@angular/router';

import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
declare var window: any; 
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.page.html',
  styleUrls: ['./profile-setting.page.scss'],
})
export class ProfileSettingPage implements OnInit {
	
	public win: any = window;
	MyprofessionValue : string ;
 	profiletab: string = "Basic";
  	isAndroid: boolean = false;
  	profile: any;
	IMAGES_URL: any = config.IMAGES_URL;
	errors = config.errors;
	bgImage: any;
	name: any;
	email: any;
	contact: any;
	reg_exp: any;
	reg_exp_digits: any;
	reg_exp_letters: any;
	is_submit = false;
	is_submit_pass = false;
	password: any = '';
	confirm_password: any;
	confirm_new_password: any;
	live_image_url: any;
	imgBlob: any;
	live_file_name: any;
	my_image: any;
	withoutspace: any;
	is_live_image_updated_cover = false;
	is_live_image_updated_profile = false;
	image_type: any;
	image_bg_type: any;
	imgBlobProfile: any;
	live_file_name_profile: any;
	imgBlobCover: any;
	live_file_name_cover: any;
	user_name: any;
    user_image: any;
    user_email: any;
    user_id: any;
    authForm: FormGroup;
    authForm1: FormGroup;
    allowedMimes:any = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg'];
	image_error: any = false;
	image_file: any;
	image_url: any;
	image_cover_error: any = false;
	image_cover_file: any;
	image_cover_url: any;

	//test profile
  	constructor(public apiService: ApiserviceService, public router: Router, private camera: Camera, private file: File, private filePath: FilePath, private transfer: FileTransfer,private globalFooService: GlobalFooService,private formBuilder: FormBuilder, public sanitizer:DomSanitizer) { 

  		this.createForm();
  		this.reg_exp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      	this.reg_exp_letters =  /^[a-zA-Z].*$/;
      	this.reg_exp_digits = /^\d{6,10}$/;
      	this.withoutspace = /^\S*$/;
      	this.user_name = localStorage.getItem('user_name');
        this.user_image = localStorage.getItem('user_image');
        this.user_email = localStorage.getItem('user_email');
        this.user_id = localStorage.getItem('userId');
        this.globalFooService.getObservable().subscribe((data) => {
            this.user_name = localStorage.getItem('user_name');
            this.user_image = localStorage.getItem('user_image');
            this.user_email = localStorage.getItem('user_email');
            this.user_id = localStorage.getItem('userId');
        });
  	}

  	//define the validators for form fields
  	createForm(){
	    this.authForm = this.formBuilder.group({
	      name: ['', Validators.compose([Validators.required])],
	      email: ['', Validators.compose([Validators.required])],
	      contact: ['', Validators.compose([Validators.required])],
	      bio: ['', Validators.compose([Validators.required])],
	      location: ['', Validators.compose([Validators.required])],
	    });

	    this.authForm1 = this.formBuilder.group({
	      confirm_new_password: ['', Validators.compose([Validators.required])],
	      password: ['', Validators.compose([Validators.required])],
	      confirm_password: ['', Validators.compose([Validators.required])],
	    });
  	};

  	ngOnInit() {
  	}

  	logout(){
	    localStorage.clear();
	    this.router.navigate(['/landing-page']);
  	}
  	
  	ionViewDidEnter(){

  		this.get_profile();
  	}

  	getimage(img){
      if(this.errors.indexOf(img) == -1){
      if(img.includes('https') == true){
              return true;
            }else{
              return false;
            }
      }else{
        return false;
      }
    }

  	get_profile(){

	 	let dict ={
	      _id: localStorage.getItem('userId'),
	      add_user_type: 'user'
	    };
	    console.log(dict)

	    this.apiService.presentLoading();
	    this.apiService.postData(dict,'getProfile').subscribe((result) => {
	      this.apiService.stopLoading();
	      if(result.status == 1){

	      	this.authForm.patchValue({
	          	name: result.data.name,
	          	email: result.data.email,
	          	contact: result.data.contact,
	          	bio: result.data.bio,
	          	location: result.data.location,
	          	
	        });

	      	this.profile = result.data;
	      	
	      	this.bgImage = this.errors.indexOf(result.data.cover_image) >= 0 ? '../../assets/img/no-image.png' :  this.IMAGES_URL + '/images/' +  result.data.cover_image;
	      	console.log(this.profile);
	      	
	      }else{
	      	this.apiService.presentToast(result.msg, 'danger');
	      };
	    });
  	};

  	

  	update_profile(){

  		this.is_submit = true;
  		if(this.errors.indexOf(this.authForm.value.name) >= 0 || this.errors.indexOf(this.authForm.value.contact) >= 0 || this.errors.indexOf(this.authForm.value.email) >= 0 || !this.reg_exp.test(String(this.authForm.value.email).toLowerCase())  || !this.reg_exp_digits.test(String(this.authForm.value.contact))|| !this.reg_exp_letters.test(String(this.authForm.value.name)) || this.errors.indexOf(this.authForm.value.bio) >= 0 || this.errors.indexOf(this.authForm.value.location) >= 0){
	      return false;
	    };


	     if(this.is_live_image_updated_cover == true){
	    	this.profileImageSubmit(this.image_bg_type);
	    }else if(this.is_live_image_updated_profile == true){
	    	this.profileImageSubmit(this.image_type);
	    }else{
	    	// this.apiService.presentLoading();  
	    	this.finalUpdateProfile();
	    }

  	};

  	finalUpdateProfile(){
  		this.apiService.presentLoading();  
  		let dict ={
	      _id: localStorage.getItem('userId'),
	      name: this.authForm.value.name,
	      contact: this.authForm.value.contact,
	      bio: this.authForm.value.bio,
	      location: this.authForm.value.location,
	      email: this.authForm.value.email,
	      image: this.profile.image,
	      cover_image: this.profile.cover_image,
	      medium: this.profile.medium,
	    };
	    console.log(dict)

	    
	    this.apiService.postData(dict,'updateProfile').subscribe((result) => {
	      this.apiService.stopLoading();
	      if(result.status == 1){

	      	this.profile.name = this.name;

	      	localStorage.setItem('user_name', this.authForm.value.name);
  			localStorage.setItem('user_image', this.authForm.value.image);
  			localStorage.setItem('user_email', this.authForm.value.email);

	      	this.apiService.presentToast(result.msg, 'success');
	      	this.globalFooService.publishSomeData({
            	foo: {'data': result.data, 'page': 'updateprofile'}
        	});

	      }else{
	      	this.apiService.presentToast(result.msg, 'danger');
	      };
	    });
  	}


  	update_password(){

  		this.is_submit_pass = true;
  		if(this.errors.indexOf(this.authForm1.value.confirm_password) >= 0 || this.authForm1.value.confirm_password.length < 6 || this.errors.indexOf(this.authForm1.value.confirm_new_password) >= 0 || this.authForm1.value.confirm_new_password.length < 6 || !this.withoutspace.test(this.authForm1.value.confirm_password) ){
	      return false;
	    };

	    if(this.profile.medium == 'simple'){
	    	if(this.errors.indexOf(this.password) >= 0 || this.authForm1.value.password.length < 6 || !this.withoutspace.test(this.authForm1.value.password)){
	    		return false;
	    	}
	    }

	    if(this.authForm1.value.confirm_password != this.authForm1.value.confirm_new_password){
	    	return false;
	    }

	    let dict ={
	      _id: localStorage.getItem('userId'),
	      password: this.authForm1.value.password,
	      new_password: this.authForm1.value.confirm_password
	    };
	    console.log(dict)

	    this.apiService.presentLoading();
	    this.apiService.postData(dict,'updatePassword').subscribe((result) => {
	      this.apiService.stopLoading();
	      if(result.status == 1){
	      	this.authForm1.value.password = '';
	      	this.authForm1.value.confirm_password = '';
	      	this.authForm1.value.confirm_new_password = '';
	      	this.is_submit_pass = false;
	      	this.apiService.presentToast(result.msg, 'success');
	      }else{
	      	this.apiService.presentToast(result.msg, 'danger');
	      };
	    });

  	};

  	async selectCoverImage(type) {
  		this.image_bg_type = type;
	    const actionSheet = await this.apiService.actionSheetController.create({
	      header: "Select Cover Image",
	      buttons: [{
	            text: 'From Gallery',
	            handler: () => {
	                this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, type);
	            }
	        },
	        {
	            text: 'Use Camera',
	            handler: () => {
	                this.takePicture(this.camera.PictureSourceType.CAMERA, type);
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
  	async selectImage(type) {
  		this.image_type = type;
	    const actionSheet = await this.apiService.actionSheetController.create({
	      header: "Select Image",
	      buttons: [{
	            text: 'From Gallery',
	            handler: () => {
	                this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, type);
	            }
	        },
	        {
	            text: 'Use Camera',
	            handler: () => {
	                this.takePicture(this.camera.PictureSourceType.CAMERA, type);
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



	takePicture(sourceType: PictureSourceType, type) {
	    
	    var options: CameraOptions = {
	        quality: 25,
	        sourceType: sourceType,
	        saveToPhotoAlbum: false,
	        correctOrientation: true,
	        allowEdit: true
	    };

	    this.camera.getPicture(options).then(imagePath => {
	      if (sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
	         
	          if(type == 'profile'){
	          	this.live_image_url = imagePath;
	          	 this.is_live_image_updated_profile = true;
	          }
	          

	          if(type == 'cover'){
	          	this.bgImage = this.win.Ionic.WebView.convertFileSrc(imagePath);
	          	 this.is_live_image_updated_cover = true;
	          }

	          
	          this.filePath.resolveNativePath(imagePath)
	              .then(filePath => {
	                this.startUpload(imagePath, type);
	              });
	      } else {
	        

	        if(type == 'profile'){
	          	this.live_image_url = imagePath;
	          	this.is_live_image_updated_profile = true;
          	}

	          if(type == 'cover'){
	          	this.bgImage = this.win.Ionic.WebView.convertFileSrc(imagePath);
	          	 this.is_live_image_updated_cover = true;
	          }
	        this.startUpload(imagePath, type);
	      }
	    }, (err) => {
	     console.log('err')
	     console.log(err)
	    });
	};

	  startUpload(imageData, type) {
	    this.file.resolveLocalFilesystemUrl(imageData).then(entry => {
	        ( < FileEntry > entry).file(file => {
	        this.readFile(file, type)
	        })
	    })
	    .catch(err => {
	        this.apiService.presentToast('Error while reading file.','danger');
	    });
	  }

  readFile(file: any, type) {
    var self = this;
    const reader = new FileReader();
    reader.onloadend = () => {
    	if(type == 'profile'){
    		const imgBlobProfile = new Blob([reader.result], {
	            type: file.type
	        });
	        self.imgBlobProfile = imgBlobProfile;
	        self.live_file_name_profile = file.name;
    	}else{
    		const imgBlobCover = new Blob([reader.result], {
	            type: file.type
	        });
	        self.imgBlobCover = imgBlobCover;
	        self.live_file_name_cover = file.name;
    	}

        // const imgBlob = new Blob([reader.result], {
        //     type: file.type
        // });
        // self.imgBlob = imgBlob;
        // self.live_file_name = file.name;
       
        //self.profileImageSubmit(type);
    };
    reader.readAsArrayBuffer(file);
  }


  	profileImageSubmit(type){
	    // this.apiService.presentLoading();
	    const frmData = new FormData();
	    if(type == 'profile'){
	      frmData.append('file', this.image_file, this.image_file.name);
	      frmData.append("live_image", this.image_file.name.replace(/ /g,"_")); 
	    }else{
	    	frmData.append('file', this.image_cover_file, this.image_cover_file.name);
	      	frmData.append("live_image", this.image_cover_file.name.replace(/ /g,"_")); 
	    }
	    frmData.append("userId", localStorage.getItem('userId'));
	    frmData.append("type", type);
	  
	    this.apiService.postData(frmData,'update_user_and_cover_image').subscribe((result) => { 
	      
	      if(result.status == 1){
	      	if(type == 'cover'){
	      		this.bgImage = this.IMAGES_URL + '/images/' +  result.data;
	      		 //this.apiService.presentToast('Cover picture updated successfully','success');
	      		 this.profile.cover_image = result.data;
	      		 this.is_live_image_updated_cover = false;
	      	}else{
	      		this.profile.image = result.data;
	      		this.is_live_image_updated_profile = false;
	      		 //this.apiService.presentToast('Profile picture updated successfully','success');
	      	}

	      	if(this.is_live_image_updated_cover == true){
	    		this.profileImageSubmit(this.image_bg_type);
		    }else if(this.is_live_image_updated_profile == true){
		    	this.profileImageSubmit(this.image_type);
		    }else{
		    	
		    	this.finalUpdateProfile();
		    }

	      	

	        

	        // this.apiService.events.publish('user_profile_updated:true',{fname: this.my_fname,lname: this.my_lname, email: this.my_email, is_my_image_social: '0', my_image: this.my_image});
	       
	      }
	      else{
	        this.apiService.presentToast('Error while sending request,Please try after some time','success');
	      }
	    },
	    err => {
	        this.apiService.presentToast('Technical error,Please try after some time','success');
	    });
  	}

  	update_user_image(){

  	}

  	uploadProImage(event){
   		this.image_type = 'profile';
	    var self = this;
	    if (event.target.files && event.target.files[0]) {
	      var reader = new FileReader();
	      var image_file = event.target.files[0];
	      if(self.allowedMimes.indexOf(image_file.type) == -1){
	        self.is_live_image_updated_profile = true;
	      }
	      else{
	        console.log('type is profile');
	          self.image_file = image_file;
	          self.image_url = window.URL.createObjectURL(image_file);
	          self.is_live_image_updated_profile = true;
	        
	      }
	    }
	  }

	  uploadCoverImage(event){
   		
   		this.image_bg_type = 'cover';
	    var self = this;
	    if (event.target.files && event.target.files[0]) {
	      var reader = new FileReader();
	      var image_cover_file = event.target.files[0];
	      if(self.allowedMimes.indexOf(image_cover_file.type) == -1){
	        self.is_live_image_updated_cover = true;
	      }
	      else{
	        console.log('type is cover');
	          self.image_cover_file = image_cover_file;
	          self.image_cover_url = window.URL.createObjectURL(image_cover_file);
	          self.bgImage = self.sanitizer.bypassSecurityTrustUrl(self.image_cover_url);
	          self.is_live_image_updated_cover = true;
	        
	      }
	    }
	  }

}
