import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Router } from '@angular/router';
import { Location } from "@angular/common";

@Component({
  selector: 'app-followingfollowers',
  templateUrl: './followingfollowers.page.html',
  styleUrls: ['./followingfollowers.page.scss'],
})
export class FollowingfollowersPage implements OnInit {
	
	listing: any;
	IMAGES_URL: any = config.IMAGES_URL;
	errors = config.errors;
	is_response = false;
	str = 'Following';
	user_name: any;
    user_image: any;
    user_email: any;
    user_id: any;
    noti_count = localStorage.getItem('notiCount');
    userId = localStorage.getItem('userId');
    clickUserId = localStorage.getItem('clickUserId');

  	constructor(private ref: ChangeDetectorRef,public location: Location,public apiService: ApiserviceService, public router: Router, private globalFooService: GlobalFooService) { 


  		if(localStorage.getItem('friend') == 'follower'){
    		this.str = 'Follower';
	    }else{
	    	this.str = 'Following';
	    }

	    this.user_name = localStorage.getItem('user_name');
        this.user_image = localStorage.getItem('user_image');
        this.user_email = localStorage.getItem('user_email');
        this.user_id = localStorage.getItem('userId');
       

  		this.globalFooService.getObservable().subscribe((data) => {
          	console.log('Data received', data);
          	this.listing = [];
          	this.is_response = false;
          	this.clickUserId = localStorage.getItem('clickUserId');
          	this.user_name = localStorage.getItem('user_name');
            this.user_image = localStorage.getItem('user_image');
            this.user_email = localStorage.getItem('user_email');
            this.user_id = localStorage.getItem('userId');
          	if(localStorage.getItem('friend') == 'follower'){
	    		this.str = 'Follower';
		    }else{
		    	this.str = 'Following';
		    }
      	});
  	}

  	logout(){
	    var categoryCheck = JSON.parse(localStorage.getItem('categoriesCheck'));
	    localStorage.clear();
	    localStorage.setItem('categoriesCheck', JSON.stringify(categoryCheck));
	    this.router.navigate(['/landing-page']);
  	}

  	ngOnInit() {
  		this.listing = [];
  		this.is_response = false;
  	}

  	ngOnDestroy(){
      // alert('leaveccc');
      this.apiService.stopLoading();
     
    }

  	ionViewDidEnter(){
  		this.noti_count = localStorage.getItem('notiCount');
  		this.is_response = false;
  		this.listing = [];
  		this.getData();
  	}

  	dismiss(){
      this.location.back();

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

  	gotofollowing(){
      var user_id = localStorage.getItem('userId');
      localStorage.setItem('clickUserId' , user_id)
    }

  	getData(){
	    let dict = {
	      //userId: localStorage.getItem('userId')
	      userId: this.clickUserId
	    };
	    this.apiService.presentLoading();
	    var apiname;
	    if(localStorage.getItem('friend') == 'follower'){
	    	apiname = 'followersListingTab';
	    }else{
	    	apiname = 'followingListingTab';
	    }
	    
	    this.apiService.postData(dict,apiname).subscribe((result) => {
	      this.apiService.stopLoading();
	      
	      if(result.status == 1){
	         this.listing = result.data;
	         this.is_response = true;
	         console.log(this.listing);
	      }
	      else{
	        this.apiService.presentToast('Technical error,Please try after some time.','danger');
	        this.apiService.stopLoading(); 
	      }
	      this.ref.detectChanges();
	    },
	    err => {
	      this.apiService.stopLoading();
	        this.apiService.presentToast('Technical error,Please try after some time.','danger');
	        this.apiService.stopLoading(); 
	    });
  	}

  	async presentAlertConfirm(item, i) {
	    const alert = await this.apiService.alertController.create({
	      header: 'Confirm Unfollow',
	      message: 'Are you sure to unfollow?',
	      buttons: [
	       {
	          text: 'OK',
	          handler: () => {
	            console.log('Confirm Okay');
	            this.remove(item, i);
	            
	          }
	        },
	        {
	          text: 'Cancel',
	          handler: () => {
	          }
	        }
	      ]
	    });

	    await alert.present();
	}

 	remove(item, index){

	  	let dict = {
	      userId: localStorage.getItem('userId'),
	      //friendId: item.friendData[0].friendId,
	      friendId: item._id,
	    };
	    this.apiService.presentLoading();
	    this.apiService.postData(dict,'removeFriend').subscribe((result) => {
	      this.apiService.stopLoading();
	      this.ref.detectChanges();
	      if(result.status == 1){
	        this.listing.splice(index, 1);
	        // this.globalFooService.publishSomeData({
	        //   foo: {'data': result.data, 'page': 'add-post'}
	        // });
	      }
	      else{
	        this.apiService.presentToast('Technical error,Please try after some time.','danger');
	        this.apiService.stopLoading(); 
	      }
	    },
	    err => {
	      this.apiService.stopLoading();
	        this.apiService.presentToast('Technical error,Please try after some time.','danger');
	        this.apiService.stopLoading(); 
	    });
  	}

  	

    viewUser(item){
    	localStorage.setItem('clicked_user_id', item._id);
    	localStorage.setItem('add_user_type', 'user');
    	this.router.navigate(['/user-profile'])
    }

}
