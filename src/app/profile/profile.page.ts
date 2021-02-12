import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Router } from '@angular/router';
declare var Branch;
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { MenuController, AlertController , Platform} from '@ionic/angular';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
	
	profile: any;
	IMAGES_URL: any = config.IMAGES_URL;
	errors = config.errors;
	bgImage: any;
	userId: any;
	data: any;
	loggedUserId: any = localStorage.getItem('userId');
	is_response = false;
  counter = 0;
  selectedItemm = -1;
  user_name: any;
  user_image: any;
  user_email: any;
  user_id: any;
  platform1: any;
  
  	constructor(private globalFooService: GlobalFooService,public apiService: ApiserviceService, public router: Router,private socialSharing: SocialSharing, private iab: InAppBrowser, public alertController: AlertController, private platform: Platform) { 
      this.user_name = localStorage.getItem('user_name');
      this.user_image = localStorage.getItem('user_image');
      this.user_email = localStorage.getItem('user_email');
      this.user_id = localStorage.getItem('userId');
      this.globalFooService.getObservable().subscribe((data) => {
          console.log('Data received', data);
          this.counter = 1;
          this.get_profile();
          this.user_name = localStorage.getItem('user_name');
          this.user_image = localStorage.getItem('user_image');
          this.user_email = localStorage.getItem('user_email');
          this.user_id = localStorage.getItem('userId');
      });
    }

  	ngOnInit() {
      this.platform1 = this.platform.is('cordova');
  	}

    logout(){
      localStorage.clear();
      this.router.navigate(['/landing-page']);
    }

    openUpdate(i){
      if(this.selectedItemm == i){
        this.selectedItemm = -1;
      }else{
      this.selectedItemm = i;
      }
      

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

   

  	ionViewDidEnter(){
      this.counter = 0;
  		this.userId = localStorage.getItem('userId');
  		
  		
  		this.get_profile();
  	}


    openLink(web_link){
      //window.open(web_link, '_system');
      if(web_link.includes('http') == false  || web_link.includes('https') == false){

        web_link = 'http://'  + web_link;
      }
      this.iab.create(web_link, '_system', {location: 'yes', closebuttoncaption: 'done'});
    }

    gotoFollowersFollowings(str){
      localStorage.setItem('friend', str);
      this.globalFooService.publishSomeData({
          foo: {'data': '', 'page': 'updateprofile'}
      });
      this.router.navigate(['/followingfollowers'])
      //this.apiService.navCtrl.navigateRoot('tabs/following');
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

  	get_profile(){

	 	let dict ={
	      _id: this.userId,
        add_user_type: 'user'
	    };
	    console.log(dict)

      if(this.counter == 0){
        this.apiService.presentLoading();
      }
	    
	    this.apiService.postData(dict,'getProfile').subscribe((result) => {
	     
	      if(result.status == 1){
	      	this.profile = result.data;
	      	this.bgImage = this.errors.indexOf(result.data.cover_image) >= 0 ? '../../assets/img/no-image.png' :  this.IMAGES_URL + '/images/' + result.data.cover_image;
	      	console.log(this.profile);
	      	this.getData();
	      }else{
	      	this.apiService.presentToast(result.msg, 'danger');
	      };
	    });
  	}


  	getData(){
     
      this.apiService.postData({'userId': localStorage.getItem('userId'), 'loggedUserId': localStorage.getItem('userId'), add_user_type: 'user'},'influencerProfile').subscribe((result) => {
        this.apiService.stopLoading();
        console.log(result)
        if(result.status == 1){
          this.data = result.data;
          this.is_response = true;
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

  	goto_profile_setting(){
  		this.router.navigate(['/profile-setting/', this.profile._id]);
  	}

  	like(likesArray, index){
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
        userId: this.userId,
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
              if(likesArray[i].userId == this.userId){
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
    this.selectedItemm = -1;
      localStorage.setItem('item', JSON.stringify(post));
      localStorage.setItem('postId', post._id);
      this.router.navigate(['/post-details']);
  }

  viewComments(post){
    this.selectedItemm = -1;
    localStorage.setItem('item', JSON.stringify(post));
    localStorage.setItem('postId', post._id);
    this.router.navigate(['/comments']);
  }


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

          this.apiService.presentToast(result.msg, 'success');
      });
    };


    //edit post
  editPost(item, i){
    console.log(item, i);
    this.selectedItemm = -1;
    localStorage.setItem('postId', item._id);
    localStorage.setItem('route', '/tabs/profile');
    this.router.navigate(['/edit-reccomendation'])
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

  async presentAlertConfirm(item, i) {
      const alert = await this.alertController.create({
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
