import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
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
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, ToastController, LoadingController , ActionSheetController, Platform, AlertController,NavController} from '@ionic/angular';
@Component({
  selector: 'app-edit-reccomendation',
  templateUrl: './edit-reccomendation.page.html',
  styleUrls: ['./edit-reccomendation.page.scss'],
})


export class EditReccomendationPage implements OnInit {
	
	public win: any = window;
	type: any = 'Photo';
	category: any = '';
	description: any;
	loading: any;
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
	is_submit_platform = false;
	post: any;
	categories: any;
	subcategories: any = [];
	user_name: any;
    user_image: any;
    user_email: any;
    user_id: any;
	authForm: FormGroup;
	link_content: any;
	opencontent: any;
	allowedMimes:any = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg'];
	image_error: any = false;
	image_file: any;
	image_url: any;
	is_image_uploaded: any;
	typeTab = 'Photo';
	counter = 0;
	platforms: any;
	plat_value = 'Others';
	plat_selected_value = '';
	noti_count = localStorage.getItem('notiCount');
	selected_cat: any = '';

 	constructor(private ref: ChangeDetectorRef,public apiService: ApiserviceService, public router: Router, private camera: Camera, private file: File, private filePath: FilePath,  private transfer: FileTransfer, public location: Location, private globalFooService: GlobalFooService,private formBuilder: FormBuilder, public sanitizer:DomSanitizer, public loadingController: LoadingController) { 
  		
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

  	ngOnDestroy(){
      // alert('leaveccc');
      this.apiService.stopLoading();
     
    }

  	gotofollowing(){
      var user_id = localStorage.getItem('userId');
      localStorage.setItem('clickUserId' , user_id)
    }


  	onSegmentChanged(event){

  		console.log(event.detail.value);
  		if(event.detail.value == 'Photo'){

  		}else if(event.detail.value == 'Website'){
  		
  		}else{

  		}
  	}

  	async presentLoading() {
        if (this.errors.indexOf(this.loading) >= 0) {
            this.loading = await this.loadingController.create({ 
            	spinner: 'bubbles', cssClass: 'my-loading-class'});
        }
        this.ref.detectChanges();
        await this.loading.present();
    }

    async stopLoading() {
        if (this.errors.indexOf(this.loading) == -1) {
        	this.ref.detectChanges();
	      	await this.loading.dismiss();
	      	this.loading  = null;
	    }
	    else{
	      	var self = this;
	      	setTimeout(function(){
	        	self.stopLoading();
	      	},1000);
	    }
    }

  	//define the validators for form fields
  	createForm(){
	    this.authForm = this.formBuilder.group({
	      title: ['', Validators.compose([Validators.required])],
	      type: ['', Validators.compose([Validators.required])],
	      description: ['', Validators.compose([Validators.required])],
	      category: ['', Validators.compose([Validators.required])],
	      platform: ['', Validators.compose([Validators.required])],
	      platform_name: [''],
	      sub_category: ['', Validators.compose([Validators.required])],
	      web_link: ['', Validators.compose([Validators.required])],
	    });
  	};

  	checklink(link){
  		console.log(link);
  		var self = this;
		var target = link;
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
	  	this.presentLoading();
	    this.apiService.postData(dict,'scrapUrl').subscribe((result) => { 
	      this.stopLoading(); 
	      this.ref.detectChanges(); 
	      console.log(result)
	      this.opencontent = true;
		this.link_content = result;
		this.stopLoading();
	    },
	    err => {
	        this.apiService.presentToast('Technical error,Please try after some time','success');
	    });
		
  		
  	}


  	logout(){
	    var categoryCheck = JSON.parse(localStorage.getItem('categoriesCheck'));
	    localStorage.clear();
	    localStorage.setItem('categoriesCheck', JSON.stringify(categoryCheck));
	    this.router.navigate(['/landing-page']);
  	}

  	typeChange(type){
  		if(type == 'Photo'){
  			this.authForm.patchValue({ web_link : ''});
  		}else if(type == 'Website'){
  			this.live_image_url = '';
  			this.is_live_image_updated = false;
  			this.imgBlob = '';
  			this.live_file_name = '';
  			this.image = '';
  			this.image_file = '';
			this.image_url = '';
			this.is_live_image_updated = false;
  		}else{
  			this.authForm.patchValue({ web_link : ''});
  			this.live_image_url = '';
  			this.is_live_image_updated = false;
  			this.imgBlob = '';
  			this.live_file_name = '';
  			this.image = '';
  			this.image_file = '';
			this.image_url = '';
			this.is_live_image_updated = false;
  		}
  		this.ref.detectChanges();
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


  	dismiss(){
      this.location.back();
    }

  	ionViewDidEnter(){
  		this.noti_count = localStorage.getItem('notiCount');
  		this.counter = 0;
  		this.getPlatforms();
  		this.getCategories();
  	}

  	closeLinkContent(){
  		this.opencontent = false;
  	}


  	getCategories(){

  		this.presentLoading();
  		var dict = {
	    	user_id: localStorage.getItem('userId')
	    }
	  
	    this.apiService.postData(dict,'categories').subscribe((result) => { 
	     //this.stopLoading(); 
	     
	      if(result.status == 1){
	        this.categories = result.data;	
	        
	        this.authForm.patchValue({
	        	sub_category: ''
	        });
	        this.stopLoading();
	        this.ref.detectChanges(); 
	        this.counter = 1;
	        this.getSubCategories(localStorage.getItem('category_id'), '');
	        // this.getPlatforms(localStorage.getItem('category_id'), '');
	        //this.getData();        
	        
	      }
	      else{
	        this.apiService.presentToast('Error while sending request,Please try after some time','success');
	      }
	    },
	    err => {
	        this.apiService.presentToast('Technical error,Please try after some time','success');
	    });
  	}

  	getPlatforms(){

  		// this.presentLoading();
  	
	    this.apiService.postData({},'platform_listing').subscribe((result) => { 
	      this.stopLoading();  
	      this.ref.detectChanges();
	      if(result.status == 1){
	        this.platforms = result.data;
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


  	getSubCategories(cat_id, str){

  		console.log('cat_id = ', cat_id, str)

  		if(this.counter == 0){
  			this.presentLoading();
  		}
  		
  		var dict = {
	    	cat_id: cat_id
	    }
	  
	    this.apiService.postData(dict,'subCategoryListingAdmin').subscribe((result) => { 
	      
	      
	      console.log('sub categories = ', result )
	      if(result.status == 1){
	        this.subcategories = result.data;
	        this.ref.detectChanges();
	      }
	      else{
	        //this.apiService.presentToast('Error while sending request,Please try after some time','success');
	      }
	      if(str == 'change_subcat'){

	      }else{
	      	this.getData();
	      }
	      this.ref.detectChanges();
	      this.stopLoading();  
	      
	    },
	    err => {
	        this.apiService.presentToast('Technical error,Please try after some time','success');
	    });
  	}

  	platformSelection(event){

  		this.plat_selected_value = this.platforms[this.platforms.findIndex(x => x._id == event.detail.value)].name;

  		if(this.plat_selected_value === 'Others'){
		    this.authForm.controls['platform_name'].setValidators([Validators.required]);              
		} else {                
		    this.authForm.controls['platform_name'].clearValidators();               
		}
		this.authForm.controls['platform_name'].updateValueAndValidity();
  	}

  	yourFunction(event){
  		console.log(event);
  		this.counter = 0;
  		this.subcategories = [];
  		this.authForm.patchValue({
  			sub_category: '',
  			platform: ''
  		})
  		localStorage.setItem('category_id', event.detail.value);

  		console.log(this.categories[this.categories.findIndex(x => x._id == event.detail.value)].name)
  		this.selected_cat = this.categories[this.categories.findIndex(x => x._id == event.detail.value)].name;


  		if(this.categories[this.categories.findIndex(x => x._id == event.detail.value)].name === 'Movies' || this.categories[this.categories.findIndex(x => x._id == event.detail.value)].name === 'Shows/Series'){
		    this.authForm.controls['platform'].setValidators([Validators.required]);              
		} else {                
		    this.authForm.controls['platform'].clearValidators();               
		}
		this.authForm.controls['platform'].updateValueAndValidity();

  		this.getSubCategories(localStorage.getItem('category_id'), 'change_subcat');
  	}

  	getData(){
      let dict = {
        'postId': localStorage.getItem('postId'),
        'user_id': localStorage.getItem('userId'),
      };

      // this.presentLoading();
        this.apiService.postData(dict,'postDetail').subscribe((result) => {
          this.stopLoading();
          this.ref.detectChanges();
          console.log(result)
          if(result.status == 1){
          	this.authForm.patchValue({
	          	title: result.data[0].title,
	          	type: result.data[0].type,
	          	category: result.data[0].category_id,
	          	platform: result.data[0].platform_id,
	          	sub_category: result.data[0].sub_category_id,
	          	description: result.data[0].description,
	          	web_link: result.data[0].web_link,
	          	
	        });
	        this.typeTab = result.data[0].type;

	        var self = this;
	        if(this.errors.indexOf(result.data[0].web_link) == -1){
				var target = result.data[0].web_link;
				var dict = {
			    	url: target
			    }
			  	// this.presentLoading();
			    this.apiService.postData(dict,'scrapUrl').subscribe((result) => { 
		     	 	this.stopLoading();  
		     	 	this.ref.detectChanges();
			      	console.log(result)
			      	this.opencontent = true;
					this.link_content = result;
			    },
			    err => {
			        this.apiService.presentToast('Technical error,Please try after some time','success');
			    });
				
			};
              this.post = result.data[0];
            	
              this.image = result.data[0].image;
              this.link_content = result.data[0].web_link_content;
              // this.getSubCategories(result.data[0].category_id);
          }
          else{
              this.apiService.presentToast('Technical error,Please try after some time.','danger');
          }
        },
        err => {
          this.stopLoading();
            this.apiService.presentToast('Technical error,Please try after some time.','danger');
        });
    };

    add_platform(){
  		this.is_submit_platform = true;
  		if(this.errors.indexOf(this.authForm.value.platform_name) >= 0){
	      return false;
	    }
	    this.presentLoading(); 
     	this.apiService.postData({name: this.authForm.value.platform_name},'add_platform').subscribe((result) => { 
	      
	      if(result.status == 1){
	        this.apiService.presentToast(result.msg,'success');
	        this.stopLoading(); 
	        this.plat_selected_value = '';

	  		if(this.plat_selected_value === 'Others'){
			    this.authForm.controls['platform_name'].setValidators([Validators.required]);              
			} else {                
			    this.authForm.controls['platform_name'].clearValidators();               
			}
			this.authForm.controls['platform_name'].updateValueAndValidity();
	       	this.ref.detectChanges(); 
	       	this.getPlatforms();
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
  		console.log(this.authForm.value.type, this.authForm.value.category, this.authForm.value.description,this.authForm.value.web_link);

  		if(this.errors.indexOf(this.authForm.value.category) >= 0 || this.errors.indexOf(this.authForm.value.title) >= 0){
	      return false;
	    }
  		if(this.authForm.value.type != 'Website'){
  			if(this.errors.indexOf(this.authForm.value.description) >= 0){
		      return false;
		    }
  		}

  		if(this.errors.indexOf(this.authForm.value.sub_category) >= 0 && this.subcategories.length > 0){
	    	return false;
	    }
  		

	    if(this.authForm.value.type == 'Website'){
	    	if(this.errors.indexOf(this.authForm.value.web_link) >= 0 || !this.expression.test(this.authForm.value.web_link)){
		      return false;
		    }
	    }

	    if(this.authForm.value.type == 'Photo'){
	    	if(this.errors.indexOf(this.image) >= 0 && this.errors.indexOf(this.live_image_url) >= 0){
		      return false;
		    }
	    }
	    
	    
	    if(this.authForm.value.type == 'Photo' && this.errors.indexOf(this.image_file) == -1){
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
  		//frmData.append('file', this.imgBlob, this.live_file_name);
  		frmData.append('file', this.image_file, this.image_file.name);
  		this.apiService.postData(frmData,'uploadReccImage').subscribe((result) => { 
	      		console.log(result);
	      		this.image = result;
	      		this.ref.detectChanges();
	      		this.profileImageSubmit();	      		
	     
	    },
	    err => {
	        this.apiService.presentToast('Technical error,Please try after some time','success');
	    });
  	}

  	profileImageSubmit(){
	    this.presentLoading();
	    var dict = {
	    	title: this.authForm.value.title,
	    	type: this.authForm.value.type,
	    	description: this.authForm.value.description,
	    	category: this.authForm.value.category,
	    	platform: this.authForm.value.platform,
	    	sub_category: this.authForm.value.sub_category,
	    	web_link: this.authForm.value.web_link,
	    	image: this.image,
	    	user_id: localStorage.getItem('userId'),
	    	_id: this.post._id,
            web_link_content: this.link_content

	    }
	  
	    this.apiService.postData(dict,'updateRecc').subscribe((result) => { 
	      this.stopLoading();  
	      this.ref.detectChanges();
	      if(result.status == 1){

	      	this.authForm.value.description = '';
	      	this.is_submit = false;
	      	this.live_image_url = '';
	      	this.imgBlob = '';
	      	this.live_file_name = '';
	      	this.authForm.value.type = 'Photo';
	      	this.authForm.value.category = '';
	      	this.authForm.value.web_link = '';
	      	this.link_content = '';
	      	this.globalFooService.publishSomeData({
            	foo: {'data': result.data, 'page': 'updateprofile'}
        	});
	        
	        this.apiService.presentToast(result.msg,'success');

	        this.router.navigate([localStorage.getItem('route')])
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
	          self.is_live_image_updated = true;
	        
	      }
	    }
	  }

}
