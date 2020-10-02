import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController} from '@ionic/angular'; 
import { Router } from '@angular/router';
// import { ToastController, LoadingController, Platform } from '@ionic/angular';
import { ApiserviceService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Location } from "@angular/common";
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ImagepopupPage } from '../imagepopup/imagepopup.page';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.page.html',
  styleUrls: ['./post-details.page.scss'],
})
export class PostDetailsPage implements OnInit {
	post: any;
  	loading:any;
  	listing:any;
  	comment: any;
  	profile: any;
  	IMAGES_URL: any = config.IMAGES_URL;
    errors: any = config.errors;
  	userId: any = localStorage.getItem('userId');
  	constructor(public location: Location, public toastController: ToastController, public apiService: ApiserviceService, public loadingController: LoadingController, public router: Router, private globalFooService: GlobalFooService, private iab: InAppBrowser, public modalController: ModalController, private photoViewer: PhotoViewer) { 
      
    }

  	ngOnInit() {
  		this.profile = JSON.parse(localStorage.getItem('profile'));
  	}
    ionViewDidEnter(){
        this.getData();
    }

    async openImagePopup(image) {
      this.photoViewer.show(image);
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
        'postId': localStorage.getItem('postId'),
        'user_id': localStorage.getItem('userId'),
        'add_user_type': JSON.parse(localStorage.getItem('item')).add_user_type
      };

      this.presentLoading();
        this.apiService.postData(dict,'postDetail').subscribe((result) => {
          this.stopLoading();
          if(result.status == 1){
              this.post = result.data[0];
          }
          else{
              this.presentToast('Technical error,Please try after some time.','danger');
          }
        },
        err => {
          this.stopLoading();
            this.presentToast('Technical error,Please try after some time.','danger');
        });
    }


  	async presentToast(message,color) {
      const toast = await this.toastController.create({
        message: message,
        duration: 3000,
        position: 'bottom',
        color: color,
        // showCloseButton: true
      });
      toast.present();
    }

    async presentLoading() {
      this.loading = await this.loadingController.create();
      await this.loading.present();
    }

    dismiss(){
      this.location.back();

    }

    async stopLoading() {
      if(this.loading != undefined){
        await this.loading.dismiss();
      }
      else{
        var self = this;
        setTimeout(function(){
          self.stopLoading();
        },1000);
      }
    };

    isLikedPost(likesArray){
      //assets/imgs/like.png
      if(this.errors.indexOf(this.userId) == -1){
	      let IsLiked = false;
	      if(likesArray.length == 0){

	      }else{
	      	for(var i=0; i < likesArray.length; i++){
		       
		        if(likesArray[i].userId == this.userId){
		          IsLiked = true;
		        }
		     }
	      }
	      
	      if(IsLiked){
	        return 'thumbs-up';
	      }else{
	        return 'thumbs-up-outline';
	      }
	  }else{
	  		return 'thumbs-up-outline';
	  }
    }

    logout(){
      localStorage.clear();
      console.log('clicked')
      this.router.navigate(['/login']);
    }

    sendNotification(type){
      if(this.post.userId != this.userId){
        var dict = {
          'receiverId': this.post.userId, 
          'senderId': localStorage.getItem('sin_auth_token'),
          'type': type,
          'id': this.post._id
        };

        this.apiService.postData(dict,'saveNotification').subscribe((result) => {
          // this.stopLoading();
          console.log(result);
        },
        err => {
          console.log(err);
        });
      }
      
    }


    like(likesArray){

    	 if(this.errors.indexOf(this.userId) == -1){
	      let IsLiked = false;
	      let likeId = null;
	      for(var i=0; i < likesArray.length; i++)
	      {
	        if(likesArray[i].userId == this.userId){
	          IsLiked = true;
	          likeId = likesArray[i]._id;
	        }
	      }

	      let dict = {
	        userId: this.userId,
	        _id: likeId,
	        postId: this.post._id
	      };

	      let ApiEndPoint = IsLiked == true ? 'deleteLike' : 'addLike';

	      this.presentLoading();
	      this.apiService.postData(dict,ApiEndPoint).subscribe((result) => {
	        this.stopLoading();
	        if(result.status == 1){
	          if(!IsLiked){
	            // this.sendNotification('like');
	            this.post.likes.push(result.data);
	          }else{
	            for(var i=0; i < likesArray.length; i++)
	            {
	              if(likesArray[i].userId == this.userId){
	                this.post.likes.splice(i, 1);
	              }
	            }
	          }

	          	this.globalFooService.publishSomeData({
	            	foo: {'data': this.post, 'page': 'post'}
	        	});
	        }
	        else{
	          this.presentToast('Technical error,Please try after some time.','danger');
	        }
	      },
	      err => {
	        this.stopLoading();
	          this.presentToast('Technical error,Please try after some time.','danger');
	      });
	  }
    };

    postComment(comment){
    	if(this.errors.indexOf(comment) >= 0){
	      	this.presentToast('Please enter your comment.','danger');
	      	return false;
    	}

    	let dict = {
    		'comment': comment,
    		'postId': this.post._id,
    		'userId': this.userId
    	};

    	this.presentLoading();
      	this.apiService.postData(dict,'addComment').subscribe((result) => {
	        this.stopLoading();
	        if(result.status == 1){
	          	this.comment = '';
            	this.post.comments.push({
            		'comment': comment,
		    		'postId': this.post._id,
		    		'userId': this.userId,
		    		'user': this.profile.name,
		    		'image': this.profile.image,
		    		'medium': this.profile.medium
            	});
          
              // this.sendNotification('comment');
	          	this.globalFooService.publishSomeData({
	            	foo: {'data': this.post, 'page': 'post'}
	        	});
	        }
	        else{
	          	this.presentToast('Technical error,Please try after some time.','danger');
	        }
      	},
      	err => {
	        this.stopLoading();
          	this.presentToast('Technical error,Please try after some time.','danger');
      	});

    };



    openLink(web_link){
      if(web_link.includes('http') == false  || web_link.includes('https') == false){

        web_link = 'http://'  + web_link;
      }
      this.iab.create(web_link, '_system', {location: 'yes', closebuttoncaption: 'done'});
    }

  	addRemoveReccomdation(item, type, index){

  		let dict ={
	      user_id: localStorage.getItem('userId'),
	      recc_id: item._id, 
	      type: type
	    }
	    console.log(dict)

	    this.apiService.presentLoading();
	    this.apiService.postData(dict,'addRemoveRecc').subscribe((result) => {
	      	this.apiService.stopLoading();
	      	console.log(result);
	      	this.post.fav = type;
           this.globalFooService.publishSomeData({
            foo: {'data': '', 'page': 'add-post'}
          });
	      	this.apiService.presentToast(result.msg, 'success');
	    });
  	};

}
