import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { config } from '../services/config';
import { Router } from '@angular/router';
import { GlobalFooService } from '../services/globalFooService.service';

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
	user_name: any;
    user_image: any;
    user_email: any;
    user_id: any;
   	noti_count = localStorage.getItem('notiCount');

  	constructor(private ref: ChangeDetectorRef,public apiService: ApiserviceService, public router: Router, private globalFooService: GlobalFooService) { 
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

  	gotofollowing(){
      var user_id = localStorage.getItem('userId');
      localStorage.setItem('clickUserId' , user_id)
    }

  	viewUser(item){
    	
    	localStorage.setItem('clicked_user_id', item.senderId);
    	this.router.navigate(['/user-profile'])
    }

  	logout(){
	    var categoryCheck = JSON.parse(localStorage.getItem('categoriesCheck'));
	    localStorage.clear();
	    localStorage.setItem('categoriesCheck', JSON.stringify(categoryCheck));
	    this.router.navigate(['/landing-page']);
  	}


  	ionViewDidEnter(){
  		this.noti_count = localStorage.getItem('notiCount');
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
	      this.ref.detectChanges();
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
	      this.ref.detectChanges();
	      if(result.status == 1){
	         this.listing[i].read = 1;
	         this.notificationCount();
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

  	notificationCount(){

	    let dict ={
	      userId: localStorage.getItem('userId'),
	    };
	    
	    this.apiService.postData(dict,'notificationCount').subscribe((result) => {
	       this.ref.detectChanges();
	      if(result.status == 1){
	        localStorage.setItem('notiCount', result.data.toString());
	      }else{
	        this.apiService.presentToast(result.msg, 'danger');
	      };
	    });
  	}

}
