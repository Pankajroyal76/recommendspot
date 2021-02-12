import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Router } from '@angular/router';
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {
	
  	comments: any;
 	user_id: any;
 	IMAGES_URL: any = config.IMAGES_URL;
	errors = config.errors;
	comment: any;
	authForm: FormGroup;
	user_name: any;
  	user_image: any;
  	user_email: any;
  	is_response = false;

	constructor(public apiService: ApiserviceService, public router: Router, public location: Location, private globalFooService: GlobalFooService,private formBuilder: FormBuilder){ 
		this.user_name = localStorage.getItem('user_name');
      	this.user_image = localStorage.getItem('user_image');
      	this.user_email = localStorage.getItem('user_email');
      	this.user_id = localStorage.getItem('userId');
      	var self = this;
  		this.globalFooService.getObservable().subscribe((data) => {
            console.log('Data received', data);

        });
        this.createForm();

  	}
  	ngOnInit() {}

  	ionViewDidEnter() {
  		this.is_response = false;
  		this.getComments();
  	}

  	//define the validators for form fields
  	createForm(){
	    this.authForm = this.formBuilder.group({
	      comment: ['', Validators.compose([Validators.required])]
	    });
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

  	getComments(){

  		this.apiService.presentLoading();
  		var dict = {
	    	user_id: localStorage.getItem('userId'),
	    	post_id: localStorage.getItem('postId'),
	    }
	  
	    this.apiService.postData(dict,'getComments').subscribe((result) => { 
	     this.apiService.stopLoading();  
	     console.log(result.data);
	     this.is_response = true;
	      if(result.status == 1){
	        this.comments = result.data;	  
	      }
	      else{
	        this.apiService.presentToast('Error while sending request,Please try after some time','success');
	      }
	    },
	    err => {
	        this.apiService.presentToast('Technical error,Please try after some time','success');
	    });
  	}

  	postComment(){
    	if(this.errors.indexOf(this.authForm.value.comment) >= 0){
	      	this.apiService.presentToast('Please enter your comment.','danger');
	      	return false;
    	}

    	let dict = {
    		'comment': this.authForm.value.comment,
    		'postId': localStorage.getItem('postId'),
    		'userId': localStorage.getItem('userId')
    	};

    	this.apiService.presentLoading();
      	this.apiService.postData(dict,'addComment').subscribe((result) => {
	        this.apiService.stopLoading();
	        if(result.status == 1){
	          	
            	this.comments.push({
            		'comment': this.authForm.value.comment,
		    		'postId': localStorage.getItem('postId'),
		    		'userId': localStorage.getItem('userId'),
		    		'user': localStorage.getItem('user_name'),
		    		'image': localStorage.getItem('user_image'),
		    		'medium': localStorage.getItem('user_email'),
		    		'created_on': new Date()
            	})

            	this.authForm.patchValue({
		          	comment: ''
	          	});
          
	          	this.globalFooService.publishSomeData({
	            	foo: {'data': '', 'page': 'post'}
	        	});
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

    logout(){
	    localStorage.clear();
	    this.router.navigate(['/landing-page']);
  	}

}
