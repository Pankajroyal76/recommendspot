import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { config } from '../services/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
	
	listing: any;
	IMAGES_URL: any = config.IMAGES_URL;
	errors = config.errors;
	is_response = false;

  	constructor(public apiService: ApiserviceService, public router: Router) { }

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
	    this.apiService.postData(dict,'listNotification').subscribe((result) => {
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

  	readNoti(item, i){
  		let dict = {
	      id: item._id
	    };
	    this.apiService.presentLoading();
	    this.apiService.postData(dict,'readNotification').subscribe((result) => {
	      this.apiService.stopLoading();
	      if(result.status == 1){
	         this.listing[i].read = 1;
	         if(item.noti_type == 'add post' || item.noti_type == 'add like' || item.noti_type == 'add comment'){
			    localStorage.setItem('postId', item.itemId);
		      	this.router.navigate(['/post-details']);
	         }else if(item.noti_type == 'follow user'){
	         	localStorage.setItem('clicked_user_id', item.senderId);
    			this.router.navigate(['/user-profile']);
	         }
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

}
