import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { config } from '../services/config';
import { Router } from '@angular/router';
import { GlobalFooService } from '../services/globalFooService.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Location } from "@angular/common";
declare var Branch;
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {Platform} from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
	
	profile: any;
	IMAGES_URL: any = config.IMAGES_URL;
	errors = config.errors;
	bgImage: any;
	userId: any;
	loggedUserId: any = localStorage.getItem('userId');
	joined : any;
	data: any;
  add_user_type: any;
  counter = 0;
  user_name: any;
  user_image: any;
  user_email: any;
  user_id: any;
  platform1: any;
  selectedItemm = -1;
  posts: any;
  selectedItemmShare = -1;
  noti_count = localStorage.getItem('notiCount');
  index = -1;
  play_video = false;
  player: any;
  	
  	constructor(public sanitizer:DomSanitizer,private ref: ChangeDetectorRef,public apiService: ApiserviceService, public router: Router, private globalFooService: GlobalFooService, private iab: InAppBrowser, private socialSharing: SocialSharing,public location: Location, private platform: Platform) { 

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
      

    }

  	ngOnInit() {
      this.platform1 = this.platform.is('cordova');
      this.noti_count = localStorage.getItem('notiCount');
  	}

    stopPlayer(){
      if (this.player === undefined || !this.player || null) {
        console.log("Player could not be found.");
      } else {
        // this.player.stopVideo();
        this.player.destroy();
      }
    }

    ngOnDestroy(){
      // alert('leaveccc');
      this.apiService.stopLoading();
      if (this.player === undefined || !this.player || null) {
        console.log("Player could not be found.");
      } else {
        // this.player.stopVideo();
        console.log('destroy ');
        this.player.destroy();
        // document.getElementById('iframethree').style.display = "none";
      }

      // document.getElementById('iframethree').style.display = "none";
      this.play_video = false;
    }

    openUpdate(i){
      if(this.selectedItemm == i){
        this.selectedItemm = -1;
      }else{
      this.selectedItemm = i;
      }
    }

    gotofollowing(){
      var user_id = localStorage.getItem('userId');
      localStorage.setItem('clickUserId' , user_id)
    }

    gotoFollowersFollowings(str){
      localStorage.setItem('friend', str);
      localStorage.setItem('clickUserId' , this.userId)
      this.globalFooService.publishSomeData({
          foo: {'data': '', 'page': 'updateprofile'}
      });
      this.router.navigate(['/followingfollowers'], { replaceUrl: true })
      //this.apiService.navCtrl.navigateRoot('tabs/following');
    }


    playYoutube(web_link, index){

      if (this.player === undefined || !this.player || null) {
        console.log("Player could not be found.");
      } else {
        // this.player.stopVideo();
        this.player.destroy();
      }
      this.index = index;
      this.play_video = true;
      console.log(web_link.split('embed/')[1])
      
        // create youtube player
        // var player, iframe;
        //   this.player = new YT.Player('iframe' + index, {
        //     height: '315',
        //     width: '100%', 
        //     videoId: web_link.split('embed/')[1],
        //     playerVars: {
        //       controls: 0,
        //       disablekb: 1
        //     },
        //     events: {
        //       'onStateChange': this.onPlayerStateChange,
        //       'onReady': this.onPlayerReady
        //     }
        //   }); 
        //   // document.getElementById('setContent').style.display = "block";
        //  if (document.getElementById('iframe' + index) != undefined) {
        //   var myImg = document.getElementById('iframe' + index);
        //     myImg.setAttribute('src', 'https://www.youtube.com/embed/'  + web_link.split('embed/')[1] + '?autoplay=1');
        //       document.getElementById('iframe' + index).style.display = "block";
              
        // }            

        if(index == 0){
          this.player = new YT.Player('iframethree', {
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

           var myImg = document.getElementById('iframethree');
            console.log('myImg = ', myImg)
            myImg.setAttribute('src', 'https://www.youtube.com/embed/'  + web_link.split('embed/')[1] + '?autoplay=1');
            console.log('myImg = ', myImg)
            document.getElementById('iframethree').style.display = "block"; 


        }else{
          
          this.player = new YT.Player('iframe' + index, {
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
           var myImg = document.getElementById('iframe' + index);
            console.log('myImg = ', myImg)
            myImg.setAttribute('src', 'https://www.youtube.com/embed/'  + web_link.split('embed/')[1] + '?autoplay=1');
            console.log('myImg = ', myImg)
            document.getElementById('iframe' + index).style.display = "block";
        }
         
    }

    // when video ends
    onPlayerStateChange(event) { 
      // let ptr = this;
        let self = JSON.parse(localStorage.getItem('this'));
        // // ptr.timestamp = event.target.getDuration();
        // console.log(event, event.target.getDuration());
      // if (event.data == YT.PlayerState.PLAYING) {
     //       self.timestamp_callback(event);
     //   }
        // event.target.playVideo(); 
        console.log(event)
          if(event.data === 0) {           
             
          }
    }      

    onPlayerReady(event) {
      console.log('play = ', event)
      event.target.playVideo();
    }

    youtube_parser(url){
      var regExp = /^https?\:\/\/(?:www\.youtube(?:\-nocookie)?\.com\/|m\.youtube\.com\/|youtube\.com\/)?(?:ytscreeningroom\?vi?=|youtu\.be\/|vi?\/|user\/.+\/u\/\w{1,2}\/|embed\/|watch\?(?:.*\&)?vi?=|\&vi?=|\?(?:.*\&)?vi?=)([^#\&\?\n\/<>"']*)/i;
      var match = url.match(regExp);
      return (match && match[1].length==11)? match[1] : false;
    }

    getId(url) {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var match = url.match(regExp);

      if (match && match[2].length == 11) {
          return 'https://www.youtube.com/embed/' + match[2];
      } else {
          return 'error';
      }
    } 

    openUpdateShare(i){
      if(this.selectedItemmShare == i){
        this.selectedItemmShare = -1;
      }else{
      this.selectedItemmShare = i;
      }
      

    }
    viewComments(post){
      this.selectedItemm = -1;
      localStorage.setItem('item', JSON.stringify(post));
      localStorage.setItem('postId', post._id);
      this.router.navigate(['/comments'], { replaceUrl: true });
    }

    editPost(item, i){
      console.log(item, i);
      this.selectedItemm = -1;
      localStorage.setItem('postId', item._id);
      localStorage.setItem('category_id', item.category_id);
      localStorage.setItem('route', '/tabs/home');
      this.router.navigate(['/edit-reccomendation'], { replaceUrl: true })
    }


    //delete post
    deletePost(item, i){
      console.log(item, i);
      this.selectedItemm = -1;
      let dict = {
            _id: item._id
          };


          this.apiService.presentLoading();
          this.apiService.postData(dict,'deleteRecc').subscribe((result) => {
            this.apiService.stopLoading();
            this.ref.detectChanges();
            if(result.status == 1){
              this.data.post.splice(i, 1);
              this.apiService.presentToast(result.msg,'success');
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


    openLinkPreview(web_link){
      if(web_link.includes('http') == false  || web_link.includes('https') == false){

        web_link = 'http://'  + web_link;
      }
      this.iab.create(web_link, '_system', {location: 'yes', closebuttoncaption: 'done'});
    }

    viewPostSocial(post, link){
      localStorage.setItem('item', JSON.stringify(post));
      localStorage.setItem('postId', post._id);
      this.iab.create(link, '_system', {location: 'yes', closebuttoncaption: 'done'});
    }

    logout(){
      var categoryCheck = JSON.parse(localStorage.getItem('categoriesCheck'));
      localStorage.clear();
      localStorage.setItem('categoriesCheck', JSON.stringify(categoryCheck));
      this.router.navigate(['/landing-page'], { replaceUrl: true });
    }


    dismiss(){
      this.location.back();
    }

    ionViewWillLeave() {
      
      if (this.player === undefined || !this.player || null) {
        console.log("Player could not be found.");
      } else {
        
        console.log('destroy ');
        this.player.destroy();
        
      }

      // document.getElementById('iframethree').style.display = "none";
      this.play_video = false;
    }

  	ionViewDidEnter(){
  		// this.noti_count = localStorage.getItem('notiCount');
  		this.userId = localStorage.getItem('clicked_user_id');
  		this.notificationCount();
  		this.get_profile();
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

    openLink(web_link){
      //window.open(web_link, '_system');
      if(web_link.includes('http') == false  || web_link.includes('https') == false){

        web_link = 'http://'  + web_link;
      }
      this.iab.create(web_link, '_system', {location: 'yes', closebuttoncaption: 'done'});
    }

  	get_profile(){

    // if(this.errors.indexOf(localStorage.getItem('item')) >= 0){
    //     this.add_user_type = "user";
    // }else{
    //   this.add_user_type = JSON.parse(localStorage.getItem('item')).add_user_type;
    // }

    this.add_user_type = localStorage.getItem('add_user_type');

    

	 	let dict ={
	      _id: this.userId,
        add_user_type: this.add_user_type
	    };
	    console.log(dict)

	    this.apiService.presentLoading();
	    this.apiService.postData(dict,'getProfile').subscribe((result) => {
	      this.apiService.stopLoading();
        this.ref.detectChanges();
	      this.getData();
	      if(result.status == 1){
	      	this.profile = result.data;
	      	this.bgImage = this.errors.indexOf(result.data.cover_image) >= 0 ? '../../assets/img/no-image.png' :  this.IMAGES_URL + '/images/' + result.data.cover_image;
	      	console.log(this.profile);
	      }else{
	      	this.apiService.presentToast(result.msg, 'danger');
	      };
	    });
  	}

  	getData(){

      if(this.counter == 0)
      {
         this.apiService.presentLoading();
      }
     
      this.apiService.postData({'userId': localStorage.getItem('clicked_user_id'), 'loggedUserId': localStorage.getItem('userId') , add_user_type: this.add_user_type},'influencerProfile').subscribe((result) => {
        this.apiService.stopLoading();
        this.ref.detectChanges();
        console.log(result)
        if(result.status == 1){
          this.data = result.data;
          if(this.data.friends.length > 0){
          	this.joined = 'true';
          }else{
          	this.joined = 'false';
          }
          console.log(this.data);
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


  	follow()
    {	
    	this.apiService.presentLoading();
      	this.apiService.postData({'userId': this.loggedUserId, 'friendId': this.userId},'addFriend').subscribe((result) => {
        this.apiService.stopLoading();
        this.ref.detectChanges();
        console.log(result)
        if(result.status == 1)
        {
          this.data.friends.push(result.data);
          this.joined = 'true';
          console.log(this.data);
          this.globalFooService.publishSomeData({
            foo: {'data': result.data, 'page': 'add-post'}
          });
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

    remove(){
	  	let dict = {
	      userId: this.data.friends[0].userId,
	      friendId: this.data.friends[0].friendId,
	    };
	    this.apiService.presentLoading();
	    this.apiService.postData(dict,'removeFriend').subscribe((result) => {
	      this.apiService.stopLoading();
        this.ref.detectChanges();
	      if(result.status == 1){
	         this.joined = 'false';
	         this.data.friends.pop();
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

    like(likesArray,dislikesArray, index){
      let IsLiked = false;
      let likeId = null;
      for(var i=0; i < likesArray.length; i++)
      {
        if(likesArray[i].userId == localStorage.getItem('userId')){
          IsLiked = true;
          likeId = likesArray[i]._id;
        }
      }

      let dict = {
        userId: localStorage.getItem('userId'),
        _id: likeId,
        postId: this.data.post[index]._id
      };

      let ApiEndPoint = IsLiked == true ? 'deleteLike' : 'addLike';

      this.apiService.presentLoading();
      this.apiService.postData(dict,ApiEndPoint).subscribe((result) => {
        this.apiService.stopLoading();
        this.ref.detectChanges();
        if(result.status == 1){
          if(!IsLiked){
            this.data.post[index].likes.push(result.data);
          for(var i=0; i < dislikesArray.length; i++)
            {
              if(dislikesArray[i].userId == this.userId){
                this.data.post[index].dislikes.splice(i, 1);
              }
            }
          }else{
            for(var i=0; i < likesArray.length; i++)
            {
              if(likesArray[i].userId == localStorage.getItem('userId')){
                this.data.post[index].likes.splice(i, 1);
              }
            }
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
    };

    dislike(likesArray, dislikesArray, index){
      let IsLiked = false;
      let likeId = null;
      for(var i=0; i < dislikesArray.length; i++)
      {
        if(dislikesArray[i].userId == localStorage.getItem('userId')){
          IsLiked = true;
          likeId = dislikesArray[i]._id;
        }
      }

      let dict = {
        userId: this.userId,
        _id: likeId,
        postId: this.data.post[index]._id
      };

      let ApiEndPoint = IsLiked == true ? 'deleteDisLike' : 'addDisLike';

      this.apiService.presentLoading();
      this.apiService.postData(dict,ApiEndPoint).subscribe((result) => {
        this.apiService.stopLoading();
        this.ref.detectChanges();
        if(result.status == 1){
          if(!IsLiked){
            this.data.post[index].dislikes.push(result.data);
            for(var i=0; i < likesArray.length; i++)
            {
              if(likesArray[i].userId == this.userId){
                this.data.post[index].likes.splice(i, 1);
              }
            }
          }else{
            for(var i=0; i < dislikesArray.length; i++)
            {
              if(dislikesArray[i].userId == this.userId){
                this.data.post[index].dislikes.splice(i, 1);
              }
            }
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
    };


    isLikedPost(likesArray){
        //assets/imgs/like.png
        if(this.errors.indexOf(this.loggedUserId) == -1){

        let IsLiked = false;
        if(likesArray.length == 0){

        }else{
          for(var i=0; i < likesArray.length; i++){
           
            if(likesArray[i].userId == this.loggedUserId){
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

     viewPost(post){
      localStorage.setItem('item', JSON.stringify(post));
      localStorage.setItem('postId', post._id);
      this.router.navigate(['/post-details'], { replaceUrl: true });
    }


    viewUser(item){
      localStorage.setItem('item', JSON.stringify(item));
    	localStorage.setItem('clicked_user_id', item.user_id);
      localStorage.setItem('add_user_type', item.add_user_type);
    	this.router.navigate(['/user-profile'], { replaceUrl: true })
    }

    addRemoveReccomdation(item, type, index){

      let dict ={
        user_id: localStorage.getItem('userId'),
        recc_id: item._id, 
        type: type,
      }
      console.log(dict)

      this.apiService.presentLoading();
      this.apiService.postData(dict,'addRemoveRecc').subscribe((result) => {
          this.apiService.stopLoading();
          this.ref.detectChanges();
          console.log(result);
          this.data.post[index].fav = type;
          this.globalFooService.publishSomeData({
            foo: {'data': '', 'page': 'add-post'}
          });
          this.apiService.presentToast(result.msg, 'success');
      });
    };

         //scoial share 
  socialsharebranch(post){
      const Branch = window['Branch'];
        const self = this;

        var properties = {
          canonicalIdentifier: 'content/123',
          contentMetadata: {
                userId: post.user_id,
                postId: post._id,
                post: JSON.stringify(post)
          }
        };

        // create a branchUniversalObj variable to reference with other Branch methods
        var branchUniversalObj = null;

      Branch.createBranchUniversalObject(properties).then(function(res) {
      
          branchUniversalObj = res;

            // optional fields
            var analytics = {
              channel: 'facebook',
              feature: 'onboarding'
            }

            var properties1 = {
              $og_title: "Recommendspot",
              $deeplink_path: 'content/123',
              $match_duration: 2000,
              custom_string: 'data',
              custom_integer: Date.now(),
              custom_boolean: true
            }


          branchUniversalObj.generateShortUrl(analytics, properties1).then(function(res) {
          
                var sendlink = res.url;
                console.log(sendlink);
                var imgUrl = self.errors.indexOf(post.image) >= 0 ? null :  (self.IMAGES_URL + '/images/' + post.image);
                self.socialSharing.share('Check out the link: ', 'Recommendspot', imgUrl, sendlink);
              
    
          }).catch(function(err) {
          });

      }).catch(function(err) {
          alert('Error: ' + JSON.stringify(err))
      });
  }

  async presentAlertConfirm(item, i) {
      const alert = await this.apiService.alertController.create({
        header: 'Confirm Delete',
        message: 'Are you sure to delete?',
        buttons: [
         {
            text: 'OK',
            handler: () => {
              console.log('Confirm Okay');
              this.deletePost(item, i);
              
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
}
