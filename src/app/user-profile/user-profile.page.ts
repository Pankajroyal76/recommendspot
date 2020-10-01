import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { config } from '../services/config';
import { Router } from '@angular/router';
import { GlobalFooService } from '../services/globalFooService.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Location } from "@angular/common";
declare var Branch;
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

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
  	
  	constructor(public apiService: ApiserviceService, public router: Router, private globalFooService: GlobalFooService, private iab: InAppBrowser, private socialSharing: SocialSharing,public location: Location) { 

      

    }

  	ngOnInit() {
  	}

    dismiss(){
      this.location.back();
    }

  	ionViewDidEnter(){

  		
  		this.userId = localStorage.getItem('clicked_user_id');
  		
  		this.get_profile();
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

    this.add_user_type = JSON.parse(localStorage.getItem('item')).add_user_type;

	 	let dict ={
	      _id: this.userId,
        add_user_type: JSON.parse(localStorage.getItem('item')).add_user_type
	    };
	    console.log(dict)

	    this.apiService.presentLoading();
	    this.apiService.postData(dict,'getProfile').subscribe((result) => {
	      this.apiService.stopLoading();
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
     
      this.apiService.postData({'userId': localStorage.getItem('clicked_user_id'), 'loggedUserId': localStorage.getItem('userId') , add_user_type: JSON.parse(localStorage.getItem('item')).add_user_type},'influencerProfile').subscribe((result) => {
        this.apiService.stopLoading();
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

    remove(item){
	  	let dict = {
	      userId: this.data.friends[0].userId,
	      friendId: this.data.friends[0].friendId,
	    };
	    this.apiService.presentLoading();
	    this.apiService.postData(dict,'removeFriend').subscribe((result) => {
	      this.apiService.stopLoading();
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

    like(likesArray, index){
      if(this.errors.indexOf(this.loggedUserId) == -1){
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
              userId: this.loggedUserId,
              _id: likeId,
              postId: this.data.post[index]._id
            };
      
            let ApiEndPoint = IsLiked == true ? 'deleteLike' : 'addLike';
      
            this.apiService.presentLoading();
            this.apiService.postData(dict,ApiEndPoint).subscribe((result) => {
              this.apiService.stopLoading();
              if(result.status == 1){
                if(!IsLiked){
                  this.data.post[index].likes.push(result.data);
                }else{
                  for(var i=0; i < likesArray.length; i++)
                  {
                    if(likesArray[i].userId == this.loggedUserId){
                      this.data.post[index].likes.splice(i, 1);
                    }
                  }
                }

                this.globalFooService.publishSomeData({
                    foo: {'data': '', 'page': 'profile'}
                });
              }
              else{
                this.apiService.presentToast('Technical error,Please try after some time.','danger');
              }
            },
            err => {
              this.apiService.stopLoading();
                this.apiService.presentToast('Technical error,Please try after some time.','danger');
            });}
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
	      
	      console.log(likesArray)
	      if(IsLiked){
	        return 'thumbs-up';
	      }else{
	        return 'thumbs-up-outline';
	      }
	  	}else{
	  		return 'thumbs-up-outline';
	  	}
    }

     viewPost(post){
      localStorage.setItem('item', JSON.stringify(post));
      localStorage.setItem('postId', post._id);
      this.router.navigate(['/post-details']);
    }


    viewUser(item){
      localStorage.setItem('item', JSON.stringify(item));
    	localStorage.setItem('clicked_user_id', item.user_id);
    	this.router.navigate(['/user-profile'])
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
              $og_title: "Favreet",
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
                self.socialSharing.share('Check out the link: ', 'Favreet App', imgUrl, sendlink);
              
    
          }).catch(function(err) {
          });

      }).catch(function(err) {
          alert('Error: ' + JSON.stringify(err))
      });
  }
}
