import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-following',
  templateUrl: './following.page.html',
  styleUrls: ['./following.page.scss'],
})
export class FollowingPage implements OnInit {
	
	listing: any;
	IMAGES_URL: any = config.IMAGES_URL;
	errors = config.errors;
	is_response = false;
	str = 'Following';

  	constructor(public apiService: ApiserviceService, public router: Router, private globalFooService: GlobalFooService) { 

  		if(localStorage.getItem('friend') == 'follower'){
    		this.str = 'Follower';
	    }else{
	    	this.str = 'Following';
	    }

  		this.globalFooService.getObservable().subscribe((data) => {
          console.log('Data received', data);
          	if(localStorage.getItem('friend') == 'follower'){
	    		this.str = 'Follower';
		    }else{
		    	this.str = 'Following';
		    }
      	});

  	}

  	ngOnInit() {
  	}

  	ionViewDidEnter(){
  		this.getData();
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

  	getData(){
	    let dict = {
	      userId: localStorage.getItem('userId')
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
	      }
	    },
	    err => {
	      this.apiService.stopLoading();
	        this.apiService.presentToast('Technical error,Please try after some time.','danger');
	    });
  	}

 	remove(item, index){
	  	let dict = {
	      userId: localStorage.getItem('userId'),
	      friendId: item.friendData[0].friendId,
	    };
	    this.apiService.presentLoading();
	    this.apiService.postData(dict,'removeFriend').subscribe((result) => {
	      this.apiService.stopLoading();
	      if(result.status == 1){
	        this.listing.splice(index, 1);
	        // this.globalFooService.publishSomeData({
	        //   foo: {'data': result.data, 'page': 'add-post'}
	        // });
	      }
	      else{
	        this.apiService.presentToast('Technical error,Please try after some time.','danger');
	      }
	    },
	    err => {
	      this.apiService.stopLoading();
	        this.apiService.presentToast('Technical error,Please try after some time.','danger');
	    });
  	}

  	

    viewUser(item){
    	localStorage.setItem('clicked_user_id', item._id);
    	this.router.navigate(['/user-profile'])
    }


}
