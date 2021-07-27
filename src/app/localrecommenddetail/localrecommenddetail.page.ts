import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  selector: 'app-localrecommenddetail',
  templateUrl: './localrecommenddetail.page.html',
  styleUrls: ['./localrecommenddetail.page.scss'],
})
export class LocalrecommenddetailPage implements OnInit {
	post: any;
  	loading:any;
  	listing:any;
  	comment: any;
  	profile: any;
  	IMAGES_URL: any = config.IMAGES_URL;
    errors: any = config.errors;
  	userId: any = localStorage.getItem('userId');
    user_name: any;
    user_image: any;
    user_email: any;
    user_id: any;
    hideMe=false;	
    selectedItemmShare = -1;
    selectedItemm = -1;
    likedpost = true;
    add_user_type: any;
    noti_count = localStorage.getItem('notiCount');
    play_video = false;
    iframeid: any;
    player: any;
    hideMe2=false;
	hide2() {
		this.hideMe2 = !this.hideMe2;
	}

  	constructor(private ref: ChangeDetectorRef,public location: Location, public toastController: ToastController, public apiService: ApiserviceService, public loadingController: LoadingController, public router: Router, private globalFooService: GlobalFooService, private iab: InAppBrowser, public modalController: ModalController, private photoViewer: PhotoViewer) { 
      
      this.user_name = localStorage.getItem('user_name');
      this.user_image = localStorage.getItem('user_image');
      this.user_email = localStorage.getItem('user_email');
      this.user_id = localStorage.getItem('userId');
      this.globalFooService.getObservable().subscribe((data) => {
          this.user_name = localStorage.getItem('user_name');
          this.user_image = localStorage.getItem('user_image');
          this.user_email = localStorage.getItem('user_email');
          this.user_id = localStorage.getItem('userId');
          this.notificationCount();
      });
    }openUpdateShare(){
     if(this.selectedItemmShare == 0){
       this.selectedItemmShare = -1;
     }else{
     this.selectedItemmShare = 0;
     }
     

   }
	hide() {
	this.hideMe = !this.hideMe;
	}

  ngOnDestroy(){
    this.apiService.stopLoading();
    
    // alert('leaveccc');
    // if (this.player === undefined || !this.player || null) {
    //   console.log("Player could not be found.");
    // } else {
    //   // this.player.stopVideo();
    //   this.player.destroy();
    // }
    this.play_video = false;
  }

  youtube_parser(url){
    var regExp = /^https?\:\/\/(?:www\.youtube(?:\-nocookie)?\.com\/|m\.youtube\.com\/|youtube\.com\/)?(?:ytscreeningroom\?vi?=|youtu\.be\/|vi?\/|user\/.+\/u\/\w{1,2}\/|embed\/|watch\?(?:.*\&)?vi?=|\&vi?=|\?(?:.*\&)?vi?=)([^#\&\?\n\/<>"']*)/i;
    var match = url.match(regExp);
    return  (match && match[1].length==11)? match[1] : false;
  }


  playYoutube(web_link){

    if (this.player === undefined || !this.player || null) {
      console.log("Player could not be found.");
    } else {
      // this.player.stopVideo();
      this.player.destroy();
    }
    // this.index = index;
    this.play_video = true;
    console.log(web_link.split('embed/')[1])
    
      // create youtube player
      // var player, iframe;
        this.player = new YT.Player('iframe', {
          height: '315',
          width: '100%', 
          videoId: web_link.split('embed/')[1],
          playerVars: {
            controls: 0,
            disablekb: 1
          },
          events: {
            'onStateChange': this.onPlayerStateChange,
            'onReady': this.onPlayerReady
          }
        }); 
        // document.getElementById('setContent').style.display = "block";
       if (document.getElementById('iframe') != undefined) {
        var myImg = document.getElementById('iframe');
        myImg.setAttribute('src', 'https://www.youtube.com/embed/'  + web_link.split('embed/')[1] + '?autoplay=1');

        // document.getElementById('iframe' + index).src =  'https://www.youtube.com/embed/'  + web_link.split('embed/')[1] + '?autoplay=1';
            document.getElementById('iframe').style.display = "block";
            this.iframeid = 'iframe';
      } 
  }

  // when video ends
  onPlayerStateChange(event) { 
    // let ptr = this;
    let self = JSON.parse(localStorage.getItem('this'));  
    console.log(event)
    if(event.data === 0) {            
       
    }
  }    

  onPlayerReady(event) {

    console.log('play = ', event)
    event.target.playVideo();

  }

  gotofollowing(){
      var user_id = localStorage.getItem('userId');
      localStorage.setItem('clickUserId' , user_id)
    }
  	ngOnInit() {
  		this.profile = JSON.parse(localStorage.getItem('profile'));
      this.noti_count = localStorage.getItem('notiCount');
  	}
    ionViewDidEnter(){
        this.notificationCount();
        this.getData();
    }

    notificationCount(){

      let dict ={
        userId: localStorage.getItem('userId'),
      };
      
      this.apiService.postData(dict,'notificationCount').subscribe((result) => {
         this.ref.detectChanges();
        if(result.status == 1){
          localStorage.setItem('notiCount', result.data.toString());
          this.noti_count = localStorage.getItem('notiCount');
        }else{
          //this.apiService.presentToast(result.msg, 'danger');
        };

      });
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

    viewPostSocial(post, link){
      localStorage.setItem('item', JSON.stringify(post));
      localStorage.setItem('postId', post._id);
      this.iab.create(link, '_system', {location: 'yes', closebuttoncaption: 'done'});
    }

    viewComments(post){
      localStorage.setItem('item', JSON.stringify(post));
      localStorage.setItem('postId', post._id);
      this.router.navigate(['/comments']);
    }

     //edit post
  editPost(item){
    console.log(item);
    this.selectedItemm = -1;
    localStorage.setItem('postId', item._id);
    localStorage.setItem('category_id', item.category_id);
    localStorage.setItem('route', '/tabs/profile');
    this.router.navigate(['/edit-reccomendation'])
  }

    getData(){
      if(this.errors.indexOf(localStorage.getItem('item')) >= 0){
          this.add_user_type = "user";
      }else{
        this.add_user_type = JSON.parse(localStorage.getItem('item')).add_user_type;
      }
      let dict = {
        'postId': localStorage.getItem('postId'),
        'user_id': localStorage.getItem('userId'),
        'add_user_type': this.add_user_type
      };

      this.presentLoading();
        this.apiService.postData(dict,'postDetail').subscribe((result) => {
          this.stopLoading();
          this.ref.detectChanges();
          console.log(result)
          if(result.status == 1){
              this.post = result.data[0];
              if(this.errors.indexOf(this.userId) == -1){
                let IsLiked = false;
                if(this.post.likes.length == 0){

                }else{
                  for(var i=0; i < this.post.likes.length; i++){
                   
                    if(this.post.likes[i].userId == this.userId){
                      IsLiked = true;
                      break;
                    }
                 }
                }
                
                if(IsLiked){
                  //return 'thumbs-up';
                  this.likedpost = false;
                }else{
                 // return 'thumbs-up-outline';
                  this.likedpost = true;
                }
            }else{
               // return 'thumbs-up-outline';
                this.likedpost = true;
            }
          }
          else{
              this.presentToast('Technical error,Please try after some time.','danger');
              this.apiService.stopLoading(); 
          }
        },
        err => {
          this.stopLoading();
            this.presentToast('Technical error,Please try after some time.','danger');
            this.apiService.stopLoading(); 
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
	      if(this.post.likes.length == 0){

	      }else{
	      	for(var i=0; i < this.post.likes.length; i++){
		       
		        if(this.post.likes[i].userId == this.userId){
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

    isDisLikedPost(dislikesArray){
      //assets/imgs/like.png
      let IsLiked = false;
      if(dislikesArray.length == 0){

      }else{
        for(var i=0; i < dislikesArray.length; i++){
         
          if(dislikesArray[i].userId == this.userId){
            IsLiked = true;
          }
       }
      }
      
      if(IsLiked){
        return 'thumbs-down';
      }else{
        return 'thumbs-down-outline';
      }
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
          this.ref.detectChanges();
        },
        err => {
          console.log(err);
        });
      }
      
    }


    like(likesArray, dislikesArray){

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
          this.ref.detectChanges();
          if(result.status == 1){
            if(!IsLiked){
              // this.sendNotification('like');
              this.post.likes.push(result.data);
              this.post.like_count = this.post.like_count + 1; 
              for(var i=0; i < dislikesArray.length; i++)
              {
                if(dislikesArray[i].userId == this.userId){
                  this.post.dislikes.splice(i, 1);
                }
              }
            }else{
              for(var i=0; i < likesArray.length; i++)
              {
                if(likesArray[i].userId == this.userId){
                  this.post.likes.splice(i, 1);
                  this.post.like_count = this.post.like_count - 1;

                }
              }
              
            }

              this.globalFooService.publishSomeData({
                foo: {'data': this.post, 'page': 'post'}
            });
            this.likedpost = IsLiked;
            console.log('this.likepost = ', this.likedpost)
            console.log('IsLiked = ', IsLiked)
          }
          else{
            this.presentToast('Technical error,Please try after some time.','danger');
            this.apiService.stopLoading(); 
          }
        },
        err => {
          this.stopLoading();
            this.presentToast('Technical error,Please try after some time.','danger');
            this.apiService.stopLoading(); 
        });
    }
    };



    dislike(likesArray, dislikesArray){

       if(this.errors.indexOf(this.userId) == -1){
        let IsLiked = false;
        let likeId = null;
        for(var i=0; i < dislikesArray.length; i++)
        {
          if(dislikesArray[i].userId == this.userId){
            IsLiked = true;
            likeId = dislikesArray[i]._id;
          }
        }

        let dict = {
          userId: this.userId,
          _id: likeId,
          postId: this.post._id
        };

        let ApiEndPoint = IsLiked == true ? 'deleteDisLike' : 'addDisLike';

        this.presentLoading();
        this.apiService.postData(dict,ApiEndPoint).subscribe((result) => {
          this.stopLoading();
          this.ref.detectChanges();
          if(result.status == 1){
            if(!IsLiked){
              this.post.dislikes.push(result.data);
              for(var i=0; i < likesArray.length; i++)
              {
                if(likesArray[i].userId == this.userId){
                  this.post.likes.splice(i, 1);
                }
              }
            }else{
              for(var i=0; i < dislikesArray.length; i++)
              {
                if(dislikesArray[i].userId == this.userId){
                  this.post.dislikes.splice(i, 1);
                }
              }
            }

            this.globalFooService.publishSomeData({
                foo: {'data': this.post, 'page': 'post'}
            });
          }
          else{
            this.presentToast('Technical error,Please try after some time.','danger');
            this.apiService.stopLoading(); 
          }
        },
        err => {
          this.stopLoading();
            this.presentToast('Technical error,Please try after some time.','danger');
            this.apiService.stopLoading(); 
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
          this.ref.detectChanges();
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
              this.apiService.stopLoading(); 
	        }

      	},
      	err => {
	        this.stopLoading();
          	this.presentToast('Technical error,Please try after some time.','danger');
            this.apiService.stopLoading(); 
      	});

    };



    openLink(web_link){
      if(web_link.includes('http') == false  || web_link.includes('https') == false){

        web_link = 'http://'  + web_link;
      }
      this.iab.create(web_link, '_system', {location: 'yes', closebuttoncaption: 'done'});
    }
    openLinkPreview(web_link){
      if(web_link.includes('http') == false  || web_link.includes('https') == false){

        web_link = 'http://'  + web_link;
      }
      this.iab.create(web_link, '_system', {location: 'yes', closebuttoncaption: 'done'});
    }

  	addRemoveReccomdation(item, type){

  		let dict ={
	      user_id: localStorage.getItem('userId'),
	      recc_id: item._id, 
	      type: type
	    }
	    console.log(dict)

	    this.apiService.presentLoading();
	    this.apiService.postData(dict,'addRemoveRecc').subscribe((result) => {
	      	this.apiService.stopLoading();
          this.ref.detectChanges();
	      	console.log(result);
	      	this.post.fav = type;
           this.globalFooService.publishSomeData({
            foo: {'data': '', 'page': 'add-post'}
          });
	      	this.apiService.presentToast(result.msg, 'success');
	    },
      err => {
            this.presentToast('Technical error,Please try after some time.','danger');
            this.apiService.stopLoading(); 
        });
  	};

}

