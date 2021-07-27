import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Router } from '@angular/router';
import { Platform, IonContent } from '@ionic/angular'; 
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
	user_name: any;
    user_image: any;
    user_email: any;
    user_id: any;
    @ViewChild(IonContent, {static: true}) content: IonContent;
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

  	ngOnDestroy(){
      // alert('leaveccc');
      this.apiService.stopLoading();
     
    }
  	logout(){
	    var categoryCheck = JSON.parse(localStorage.getItem('categoriesCheck'));
	    var lat = localStorage.getItem('lat');
	    var lng = localStorage.getItem('long');
	    localStorage.clear();

	    localStorage.setItem('lat', lat);
    	localStorage.setItem('long', lng);
	    localStorage.setItem('categoriesCheck', JSON.stringify(categoryCheck));
	    this.router.navigate(['/landing-page']);
  	}

  	gotofollowing(){
      var user_id = localStorage.getItem('userId');
      localStorage.setItem('clickUserId' , user_id)
    }


  	ionViewDidEnter(){
  		this.noti_count = localStorage.getItem('notiCount');
  		this.getData();
  	}

  	gotToTop() {
	    this.content.scrollToTop(1000);
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
	    
	    this.apiService.postData(dict,'followingListingTab').subscribe((result) => {
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
	      this.ref.detectChanges();
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
