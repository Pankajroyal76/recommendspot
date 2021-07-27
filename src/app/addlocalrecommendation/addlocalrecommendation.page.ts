import { Component, OnInit,ChangeDetectorRef , ViewChild} from '@angular/core';
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
import { ModalController, ToastController, LoadingController , ActionSheetController, AlertController,NavController} from '@ionic/angular';

import { Platform, IonContent } from '@ionic/angular'; 
import {  GooglePlaceDirective } from "ngx-google-places-autocomplete";
declare var google: any;
@Component({
  selector: 'app-addlocalrecommendation',
  templateUrl: './addlocalrecommendation.page.html',
  styleUrls: ['./addlocalrecommendation.page.scss'],
})
export class AddlocalrecommendationPage implements OnInit {

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
	is_submit_platform = false;
	categories: any;
	subcategories: any = [];
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
	loading: any;
	platforms: any;
	counter = 1;
	@ViewChild(IonContent, {static: true}) content: IonContent;
	plat_value = 'Others';
	plat_selected_value = '';
	noti_count = localStorage.getItem('notiCount');
	selected_cat: any = '';
	is_linkdata = false;
	@ViewChild("placesRef") placesRef : GooglePlaceDirective;
	latitude: any;
	longitude: any;

   constructor(private ref: ChangeDetectorRef,public apiService: ApiserviceService, public router: Router, private camera: Camera, private file: File, private filePath: FilePath,  private transfer: FileTransfer, private globalFooService: GlobalFooService,private formBuilder: FormBuilder, public sanitizer:DomSanitizer, public loadingController: LoadingController) { 

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

  	public handleAddressChange(address) {
		// Do some stuff
		console.log(address)
		this.authForm.patchValue({
			location: address.formatted_address
		})

		this.geoCode(address.formatted_address)
	}
	
	geoCode(address:any) {
		let geocoder = new google.maps.Geocoder();
		geocoder.geocode({ 'address': address }, (results, status) => {
		this.latitude = results[0].geometry.location.lat();
		this.longitude = results[0].geometry.location.lng();
		console.log("lat: " + this.latitude + ", long: " + this.longitude);
	   });
	 }

  	//define the validators for form fields
  	createForm(){
	    this.authForm = this.formBuilder.group({
	      title: ['', Validators.compose([Validators.required])],
	      recc_contact: ['', Validators.compose([Validators.required])],
	      description: ['', Validators.compose([Validators.required])],
	      category: ['', Validators.compose([Validators.required])],
	      location: ['', Validators.compose([Validators.required])],
	    });
	    this.opencontent = false;
	    this.link_content = '';
	    this.getCategories();
  	};

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

  	add_local_recc(){
  		console.log(this.authForm.value);
  		this.is_submit = true;
  		console.log(this.authForm.value.title, this.authForm.value.description, this.authForm.value.category,this.authForm.value.location);
  		if(this.errors.indexOf(this.authForm.value.title) >= 0 || this.errors.indexOf(this.authForm.value.description) >= 0|| this.errors.indexOf(this.authForm.value.category) >= 0|| this.errors.indexOf(this.authForm.value.location) >= 0|| this.errors.indexOf(this.authForm.value.recc_contact) >= 0){
	      return false;
	    }
	    // if(this.errors.indexOf(this.image_file) >= 0){
	    // 	return false;
	    // };
	    if(this.errors.indexOf(this.image_file) == -1){
	    	this.uploadImage();
	    }else{
	    	this.profileImageSubmit();
	    }
  	}


  	getCategories(){

  		this.apiService.presentLoading();
  		var dict = {
	    	user_id: localStorage.getItem('userId'),
	    	type: '1'
	    }
	  
	    this.apiService.postData(dict,'onlycategories').subscribe((result) => { 
	      this.apiService.stopLoading();  
		  this.ref.detectChanges();
		  console.log(result)
	      if(result.status == 1){
	        this.categories = result.data;
	        //this.category = this.categories[0]._id;
	      }
	      else{
	        this.apiService.presentToast('Error while sending request,Please try after some time','success');
	      }
	    },
	    err => {
	        this.apiService.presentToast('Technical error,Please try after some time','danger');
	        this.apiService.stopLoading();
	    });
  	}

  	uploadImage(){
  		const frmData = new FormData();
  		// frmData.append('file', this.imgBlob, this.live_file_name);
  		frmData.append('file', this.image_file, this.image_file.name);
  		this.apiService.postData(frmData,'uploadReccImage').subscribe((result) => { 
	      		console.log(result);
	      		this.image = result;
	      		 this.ref.detectChanges();
	      		this.profileImageSubmit();	      		
	     
	    },
	    err => {
	        this.apiService.presentToast('Technical error,Please try after some time','danger');
	    });
  	}

  	profileImageSubmit(){
	    this.apiService.presentLoading();
	    var dict = {
	  //   	title: this.authForm.value.title,
	  //   	// type: this.authForm.value.type,
	  //   	type: this.typeTab,
	  //   	description: this.authForm.value.description,
	  //   	category: this.authForm.value.category,
	  //   	location: this.authForm.value.location,
	  //   	lat: this.latitude,
	  //   	long: this.longitude,
	  //   	image: this.image,
	  //   	user_id: localStorage.getItem('userId'),
			// add_user_type: 'user',

			title: this.authForm.value.title,
	    	type: this.typeTab,
	    	description: this.authForm.value.description,
	    	category: this.authForm.value.category,
	    	platform: '',
	    	sub_category: '',
	    	web_link: '',
	    	image: this.image,
	    	user_id: localStorage.getItem('userId'),
	    	add_user_type: 'user',
	    	web_link_content: '',
	    	location: this.authForm.value.location,
	    	recc_contact: this.authForm.value.recc_contact,
	    	lat: this.latitude,
	    	long: this.longitude,
	    	cords: {
	    		type: 'Point',
	    		coordinates: [this.longitude,this.latitude ]
	    	},
	    	recc_type: 'local'
	    }
	  
	    this.apiService.postData(dict,'addRecc').subscribe((result) => { 
	      
	      if(result.status == 1){

	      	this.authForm.value.description = '';
	      	this.is_submit = false;
	      	this.live_image_url = '';
	      	this.imgBlob = '';
	      	this.live_file_name = '';
	      	
	        this.authForm.reset();
	      	// this.authForm.value.type = 'Photo';
	      	// this.authForm.value.category = '';
	      	// this.authForm.value.web_link = '';
	      	this.link_content = '';
	      	
        	this.is_live_image_updated = false;
	        this.image = '';
	        
	        this.apiService.presentToast(result.msg,'success');
	        this.apiService.stopLoading(); 
	       	this.ref.detectChanges(); 
	       	this.globalFooService.publishSomeData({
            	foo: {'data': '', 'page': 'updateprofile'}
        	});
	        this.router.navigate(['/tabs/home'])
	      }
	      else{
	        this.apiService.presentToast('Error while sending request,Please try after some time','success');
	        this.apiService.stopLoading();
	      }
	    },
	    err => {
	        this.apiService.presentToast('Technical error,Please try after some time','danger');
	        this.apiService.stopLoading();
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
