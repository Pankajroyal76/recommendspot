import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
declare var window: any; 
import {getLinkPreview} from 'link-preview-js';

@Component({
  selector: 'app-add-recommendation',
  templateUrl: './add-recommendation.page.html',
  styleUrls: ['./add-recommendation.page.scss'],
})
export class AddRecommendationPage implements OnInit {
	
	public win: any = window;
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
	subcategories: any;
	user_name: any;
    user_image: any;
    user_email: any;
    user_id: any;
    IMAGES_URL: any = config.IMAGES_URL;
    link_content: any;
	opencontent: any;
	authForm: FormGroup;
	allowedMimes:any = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg'];
	image_error: any = false;
	image_file: any;
	image_url: any;
	is_image_uploaded: any;
	typeTab = 'Photo';

  	constructor(public apiService: ApiserviceService, public router: Router, private camera: Camera, private file: File, private filePath: FilePath,  private transfer: FileTransfer, private globalFooService: GlobalFooService,private formBuilder: FormBuilder, public sanitizer:DomSanitizer) { 

  		this.createForm();
  		this.expression = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

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

  	ngOnInit() {
  	}

  	//define the validators for form fields
  	createForm(){
	    this.authForm = this.formBuilder.group({
	      title: ['', Validators.compose([Validators.required])],
	      //type: ['Photo', Validators.compose([Validators.required])],
	      description: ['', Validators.compose([Validators.required])],
	      category: ['', Validators.compose([Validators.required])],
	      subcategory: ['', Validators.compose([Validators.required])],
	      web_link: ['', Validators.compose([Validators.required])],
	    });
	    this.opencontent = false;
	    this.link_content = '';
  	};

  	logout(){
	    localStorage.clear();
	    this.router.navigate(['/landing-page']);
  	}

  	closeLinkContent(){
  		this.opencontent = false;
  	}

  	

  	checklink(link){
  		console.log(link);
  		var self = this;
		// var target = link;
		// $.ajax({
		// url: "https://api.linkpreview.net",
		// dataType: 'jsonp',
		// data: {q: target, key: 'c23b499c88994dfa1fad242d8e141ee3'},
		// success: function (response) {
		// console.log(response);
		// self.opencontent = true;
		// self.link_content = response;

		// }
		// });

		var dict = {
	    	url: link
	    }
	  	this.apiService.presentLoading();
	    this.apiService.postData(dict,'scrapUrl').subscribe((result) => { 
	      this.apiService.stopLoading();  
	      console.log(result)
	      this.opencontent = true;
		this.link_content = result;
		this.apiService.stopLoading();
	    },
	    err => {
	        this.apiService.presentToast('Technical error,Please try after some time','success');
	    });
  		
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



  	getSubCategories(cat_id){

  		this.apiService.presentLoading();
  		var dict = {
	    	cat_id: cat_id
	    }
	  
	    this.apiService.postData(dict,'subCategoryListingAdmin').subscribe((result) => { 
	      this.apiService.stopLoading();  
	      if(result.status == 1){
	        this.subcategories = result.data;
	      }
	      else{
	        //this.apiService.presentToast('Error while sending request,Please try after some time','success');
	      }
	    },
	    err => {
	        this.apiService.presentToast('Technical error,Please try after some time','success');
	    });
  	}

  	yourFunction(event){

  		this.subcategories = [];
  		console.log(event);
  		this.getSubCategories(this.authForm.value.category);
  	}





  	add_recc(){

  		this.is_submit = true;
  		console.log(this.authForm.value.type, this.authForm.value.category, this.authForm.value.description,this.authForm.value.web_link);
  		if(this.errors.indexOf(this.authForm.value.category) >= 0 || this.errors.indexOf(this.authForm.value.title) >= 0){
	      return false;
	    }
  		/*if(this.authForm.value.type != 'Website'){
  			if(this.errors.indexOf(this.authForm.value.description) >= 0){
		      return false;
		    }
  		}
  		

	    if(this.authForm.value.type == 'Website'){
	    	if(this.errors.indexOf(this.authForm.value.web_link) >= 0 || !this.expression.test(this.authForm.value.web_link)){
		      return false;
		    }
	    }

	    if(this.authForm.value.type == 'Photo'){
	    	if(this.errors.indexOf(this.image_file) >= 0){
		      return false;
		    }
	    }*/

	    if(this.typeTab != 'Website'){
  			if(this.errors.indexOf(this.authForm.value.description) >= 0){
		      return false;
		    }
  		}
  		

	    if(this.typeTab == 'Website'){
	    	if(this.errors.indexOf(this.authForm.value.web_link) >= 0 || !this.expression.test(this.authForm.value.web_link)){
		      return false;
		    }
	    }

	    if(this.typeTab == 'Photo'){
	    	if(this.errors.indexOf(this.image_file) >= 0){
		      return false;
		    }
	    }
	    
	    
	    // if(this.authForm.value.type == 'Photo'){
	    // 	this.uploadImage();
	    // }else{
	    // 	this.profileImageSubmit();
	    // }
	    if(this.typeTab == 'Photo'){
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
  		// frmData.append('file', this.imgBlob, this.live_file_name);
  		frmData.append('file', this.image_file, this.image_file.name);
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
	    	title: this.authForm.value.title,
	    	// type: this.authForm.value.type,
	    	type: this.typeTab,
	    	description: this.authForm.value.description,
	    	category: this.authForm.value.category,
	    	sub_category: this.authForm.value.sub_category,
	    	web_link: this.authForm.value.web_link,
	    	image: this.image,
	    	user_id: localStorage.getItem('userId'),
	    	add_user_type: 'user',
	    	web_link_content: this.link_content
	    }
	  
	    this.apiService.postData(dict,'addRecc').subscribe((result) => { 
	      this.apiService.stopLoading();  
	      if(result.status == 1){

	      	this.authForm.value.description = '';
	      	this.is_submit = false;
	      	this.live_image_url = '';
	      	this.imgBlob = '';
	      	this.live_file_name = '';
	      	this.authForm.patchValue({
	          	type: 'Photo',
	          	category: '',
	          	description: '',
	          	web_link: '',
	          	
	        });
	      	// this.authForm.value.type = 'Photo';
	      	// this.authForm.value.category = '';
	      	// this.authForm.value.web_link = '';
	      	this.link_content = '';
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

  	uploadImages(event){
   
	    this.image_error = false;
	    var self = this;
	    if (event.target.files && event.target.files[0]) {
	      var reader = new FileReader();
	      var image_file = event.target.files[0];
	      if(self.allowedMimes.indexOf(image_file.type) == -1){
	        this.image_error = true;
	      }
	      else{
	        console.log('type is');
	          self.image_file = image_file;
	          self.image_url = window.URL.createObjectURL(image_file);
	          self.is_image_uploaded = true;
	        
	      }
	    }
	  }

}
