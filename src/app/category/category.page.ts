import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Router } from '@angular/router';
import { Location } from "@angular/common";

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
	categorytab: string = "category";
  	isAndroid: boolean = false;
  	categories: any;
  	users: any;
  	user_name: any;
  	user_image: any;
  	user_email: any;
 	user_id: any;
 	IMAGES_URL: any = config.IMAGES_URL;
	errors = config.errors;
  	
  	constructor(public apiService: ApiserviceService, public router: Router, public location: Location, private globalFooService: GlobalFooService){ 

  		this.user_name = localStorage.getItem('user_name');
      	this.user_image = localStorage.getItem('user_image');
      	this.user_email = localStorage.getItem('user_email');
      	this.user_id = localStorage.getItem('userId');
      	var self = this;
  		this.globalFooService.getObservable().subscribe((data) => {
            console.log('Data received', data);

        });

  	}

  	ngOnInit() {

  		
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

  	ionViewDidEnter() {

  		this.getCategories();
  	}

  	getCategories(){

  		this.apiService.presentLoading();
  		var dict = {
	    	user_id: localStorage.getItem('userId')
	    }
	  
	    this.apiService.postData(dict,'categories').subscribe((result) => { 
	     this.apiService.stopLoading();  
	     console.log(result.data)
	      if(result.status == 1){
	        this.categories = result.data;	        
	        this.getUsers();
	      }
	      else{
	        this.apiService.presentToast('Error while sending request,Please try after some time','success');
	      }
	    },
	    err => {
	        this.apiService.presentToast('Technical error,Please try after some time','success');
	    });
  	}


  	follow_unfollow_cat(cat, status, index){
  		this.apiService.presentLoading();
  		var dict = {
	    	user_id: localStorage.getItem('userId'),
	    	cat_id: cat._id,
	    	follow_status: status
	    }
	  
	    this.apiService.postData(dict,'followUnfollowCategory').subscribe((result) => { 
	     this.apiService.stopLoading();  
	     console.log(result.data)
	      if(result.status == 1){
	        this.categories[index].cat_follow = parseInt(status);	        
	       this.apiService.presentToast(result.error,'success');
	      }
	      else{
	        this.apiService.presentToast('Error while sending request,Please try after some time','danger');
	      }
	    },
	    err => {
	        this.apiService.presentToast('Technical error,Please try after some time','success');
	    });
  	}


  	follow_unfollow_sub_cat(sub_cat, status, index, sub_index){
  		this.apiService.presentLoading();
  		var dict = {
	    	user_id: localStorage.getItem('userId'),
	    	sub_cat_id: sub_cat._id,
	    	follow_status: status
	    }
	  
	    this.apiService.postData(dict,'followUnfollowSubCategory').subscribe((result) => { 
	     this.apiService.stopLoading();  
	     console.log(result.data)
	      if(result.status == 1){
	        this.categories[index].sub_cat[sub_index].sub_cat_follow = parseInt(status);	        
	        this.apiService.presentToast(result.error,'success');
	      }
	      else{
	        this.apiService.presentToast('Error while sending request,Please try after some time','danger');
	      }
	    },
	    err => {
	        this.apiService.presentToast('Technical error,Please try after some time','success');
	    });
  	}


  	
  	getUsers(){

  		this.apiService.presentLoading();
  		var dict = {
	    	_id: localStorage.getItem('userId')
	    }
	  
	    this.apiService.postData(dict,'usersListWeb').subscribe((result) => { 
	     this.apiService.stopLoading();  
	     console.log(result.data)
	      if(result.status == 1){
	        this.users = result.data;
	      }
	      else{
	        this.apiService.presentToast('Error while sending request,Please try after some time','success');
	      }
	    },
	    err => {
	        this.apiService.presentToast('Technical error,Please try after some time','success');
	    });
  	}

  	follow_unfollow_user(user, status, index)
    {	
    	var str;
    	if(status == '0'){
    		str = 'removeFriend';
    	}else{
    		str = 'addFriend';
    	}

    	let dict = {
	      userId: localStorage.getItem('userId'),
	      friendId: user._id,
	    };
    	this.apiService.presentLoading();
      	this.apiService.postData(dict,str).subscribe((result) => {
        this.apiService.stopLoading();
        console.log(result)
        if(result.status == 1)
        {
          this.users[index].isFriend = parseInt(status);

          this.globalFooService.publishSomeData({
            foo: {'data': status, 'page': 'add-post'}
          });
          this.apiService.presentToast( result.error,'success');
        }
        else
        {
          this.apiService.presentToast('Technical error,Please try after some time.','danger');
        }
      },
      err => {
        this.apiService.stopLoading();
          this.apiService.presentToast('Technical error,Please try after some time.','danger');
      });
    }

    logout(){
      localStorage.clear();
      this.router.navigate(['/landing-page']);
    }

}
