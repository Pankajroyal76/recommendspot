import { Component, OnInit , ElementRef, ViewChild, Renderer2} from '@angular/core';

import { ApiserviceService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Router } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { MenuController, AlertController } from '@ionic/angular'; 
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import * as $ from "jquery";
declare var window: any; 
declare var Branch;
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
	
	authForm: FormGroup;
	selectedItem:any = 'item1';
 	profiletab: string = "Basic";
	isAndroid: boolean = false;
	posts: any = [];
	is_response = false;
	IMAGES_URL: any = config.IMAGES_URL;
	errors = config.errors;
	page_number = 1;
	page_limit = 10;
	keyword = '';
	private win: any = window;
	userId: any;
	counter = 0;
	hideMe = false;
	selectedItemm = -1;
	open = false;
	type = 'Random';
  user_name: any;
  user_image: any;
  user_email: any;
  user_id: any;
	

  	constructor(public apiService: ApiserviceService, public router: Router,private socialSharing: SocialSharing, private menuCtrl: MenuController, private globalFooService: GlobalFooService, public alertController: AlertController,private formBuilder: FormBuilder,private renderer: Renderer2, private iab: InAppBrowser) { 

  		this.createForm();
      this.user_name = localStorage.getItem('user_name');
      this.user_image = localStorage.getItem('user_image');
      this.user_email = localStorage.getItem('user_email');
      this.user_id = localStorage.getItem('userId');
  		this.globalFooService.getObservable().subscribe((data) => {
            console.log('Data received', data);
            this.menuCtrl.enable(true);
            this.counter = 1;
            this.page_number = 1;
            this.is_response = false;
            this.posts = [];
            this.getAllReccomdations(false, '');
            this.user_name = localStorage.getItem('user_name');
            this.user_image = localStorage.getItem('user_image');
            this.user_email = localStorage.getItem('user_email');
            this.user_id = localStorage.getItem('userId');
        });
       
       
  	}

  	ngOnInit() {

  	
	      	}

  	//define the validators for form fields
  	createForm(){
	    this.authForm = this.formBuilder.group({
	      keyword: ['', Validators.compose([Validators.required])]
	    });
  	};

    logout(){
      localStorage.clear();
      this.router.navigate(['/']);
    }

  	closeUpdate(){
  		this.selectedItemm = -1;
  	}

  	openUpdate(i){

  		this.selectedItemm = i;

  	}

  	typeChange(type){
      if(type == 'Saved'){
    	for (let i = 0; i < this.posts.length; i++) {
		    // loop through the array, moving forwards:
		    // note in loop below we set `j = i` so we move on after finding greatest value:
		    for (let j = i; j < this.posts.length; j++) {

	     	if (parseInt(this.posts[i].fav) < parseInt(this.posts[j].fav)) {
		      	let temp = this.posts[i]; // store original value for swapping
		        this.posts[i] = this.posts[j]; // set original value position to greater value
		        this.posts[j] = temp; // set greater value position to original value
	      	};
		      
		    };
	  	};
      }else if(type == 'Comments'){
       	for (let i = 0; i < this.posts.length; i++) {
		    // loop through the array, moving forwards:
		    // note in loop below we set `j = i` so we move on after finding greatest value:
		    for (let j = i; j < this.posts.length; j++) {

		      if (this.posts[i].comment_count < this.posts[j].comment_count) {
		        let temp = this.posts[i]; // store original value for swapping
		        this.posts[i] = this.posts[j]; // set original value position to greater value
		        this.posts[j] = temp; // set greater value position to original value
		      }
		      
		    };
	  	};
      }else if(type == 'Likes'){
       	for (let i = 0; i < this.posts.length; i++) {
		    // loop through the array, moving forwards:
		    // note in loop below we set `j = i` so we move on after finding greatest value:
		    for (let j = i; j < this.posts.length; j++) {

	  

		      if (this.posts[i].like_count < this.posts[j].like_count) {
		      	let temp = this.posts[i]; // store original value for swapping
		        this.posts[i] = this.posts[j]; // set original value position to greater value
		        this.posts[j] = temp; // set greater value position to original value
		      };
		    


		      
		    };
	  	};
      }else{
      	 this.getAllReccomdations(false, '');
      }
      
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

  	ionViewDidEnter(){
  		this.userId = '';
  		
  		this.counter = 0;
  		this.is_response = false;
	    this.posts = [];
	    this.page_number = 1;
	    this.getAllReccomdations(false, '');
	    this.menuCtrl.enable(true);
	  
  	};

  	onSegmentChange(){
  		this.counter = 0;
  		this.is_response = false;
	    this.posts = [];
	    this.page_number = 1;
  		this.getAllReccomdations(false, '');
  	}

  	search(){
  		this.counter = 0;
  		this.is_response = false;
	    this.posts = [];
	    this.page_number = 1;
	    this.getAllReccomdations(false, '');
  	}

  	getAllReccomdations(isFirstLoad, event){
  		this.userId = localStorage.getItem('userId');
  		let dict ={
	      user_id: localStorage.getItem('userId'),
	      skip: this.page_number, 
	      limit: this.page_limit,
	      type: this.profiletab,
	      keyword: this.authForm.value.keyword
	    };
	    console.log(dict)
	    if(this.counter == 0){
	    	 this.apiService.presentLoading();
	    }
	   
	    this.apiService.postData(dict,'getAllRecc').subscribe((result) => {
	      	this.apiService.stopLoading();
	      	console.log(result);
	      	
	      	this.is_response = true;
	        // this.posts = result;

	        for (let i = 0; i < result.data.length; i++) {
          // loop through the array, moving forwards:
          // note in loop below we set `j = i` so we move on after finding greatest value:
          for (let j = i; j < result.data.length; j++) {

          if (parseInt(result.data[i].fav) < parseInt(result.data[j].fav)) {
              let temp = result.data[i]; // store original value for swapping
              result.data[i] = result.data[j]; // set original value position to greater value
              result.data[j] = temp; // set greater value position to original value
            };
            if (result.data[i].comment_count < result.data[j].comment_count) {
              if (result.data[i].comment_count < result.data[j].like_count) {

                let temp = result.data[i]; // store original value for swapping
                result.data[i] = result.data[j]; // set original value position to greater value
                result.data[j] = temp; // set greater value position to original value
            }else{
              if (result.data[i].like_count < result.data[j].comment_count) {
                  let temp = result.data[i]; // store original value for swapping
                  result.data[i] = result.data[j]; // set original value position to greater value
                  result.data[j] = temp; // set greater value position to original value
              };
            }
            }else if (result.data[i].like_count < result.data[j].like_count) {
               if (result.data[i].like_count < result.data[j].comment_count) {
                let temp = result.data[i]; // store original value for swapping
                result.data[i] = result.data[j]; // set original value position to greater value
                result.data[j] = temp; // set greater value position to original value
            }else{
              if (result.data[i].comment_count < result.data[j].like_count) {

                  let temp = result.data[i]; // store original value for swapping
                  result.data[i] = result.data[j]; // set original value position to greater value
                  result.data[j] = temp; // set greater value position to original value
              }
            };
            };
            // if (result.data[i].comment_count < result.data[j].like_count) {
            //   let temp = result.data[i]; // store original value for swapping
            //   result.data[i] = result.data[j]; // set original value position to greater value
            //   result.data[j] = temp; // set greater value position to original value
            // }
            // if (result.data[i].like_count < result.data[j].comment_count) {
            //  let temp = result.data[i]; // store original value for swapping
            //   result.data[i] = result.data[j]; // set original value position to greater value
            //   result.data[j] = temp; // set greater value position to original value
            // };



            
          };
        };

        this.posts = result.data;

	     //    if(result.length == 0){
	     //      this.is_response = false;
	     //      event.target.complete();
	     //    }else{
        
      //      for (let i = 0; i < result.data.length; i++) {
      //       this.posts.push(result.data[i]);
      //     }

      //   if (isFirstLoad)
      //     event.target.complete();

      //   this.page_number++;
      // }
	    });
  	}

  	doInfinite(event) {
  		this.counter = 1;
      this.getAllReccomdations(true, event);
    }

    openLink(web_link){
    	//window.open(web_link, '_system');
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
	      	this.posts[index].fav = type;
	      	if(this.profiletab == "Saved"){
	      		this.posts.splice(index, 1);
	      	}
	      	this.apiService.presentToast(result.msg, 'success');
	    });
  	};


  	share(item){
  		// this is the complete list of currently supported params you can pass to the plugin (all optional)
		var options = {
		  message: 'Share post', // not supported on some apps (Facebook, Instagram)
		  subject: 'Favreet-Share post', // fi. for email
		  files: '', // an array of filenames either locally or remotely
		  url: this.errors.indexOf(item.web_link) >= 0 ? '' : item.web_link,
		  chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title
		  appPackageName: ['com.android.bluetooth','com.android.mms','com.google.android.gm','com.google.android.gms','com.google.android.keep','cn.wps.moffice_eng','cn.wps.moffice_eng','com.facebook.katana','com.facebook.orca','com.google.android.apps.docs','com.google.android.apps.docs','com.google.android.talk','com.instagram.android','com.lenovo.anyshare.gps','com.lenovo.anyshare.gps','com.skype.raider','com.truecaller','com.whatsapp','org.videolan.vlc','sharefiles.sharemusic.shareapps.filetransfer'], // Android only, you can provide id of the App you want to share with
		};

		var onSuccess = function(result) {
		  console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
		  console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
		};

		var onError = function(msg) {
		  console.log("Sharing failed with message: " + msg);
		};

		this.win.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
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
        userId: this.userId,
        _id: likeId,
        postId: this.posts[index]._id
      };

      let ApiEndPoint = IsLiked == true ? 'deleteLike' : 'addLike';

      this.apiService.presentLoading();
      this.apiService.postData(dict,ApiEndPoint).subscribe((result) => {
        this.apiService.stopLoading();
        if(result.status == 1){
          if(!IsLiked){
            this.posts[index].likes.push(result.data);
         	for(var i=0; i < dislikesArray.length; i++)
            {
              if(dislikesArray[i].userId == this.userId){
                this.posts[index].dislikes.splice(i, 1);
              }
            }
          }else{
            for(var i=0; i < likesArray.length; i++)
            {
              if(likesArray[i].userId == this.userId){
                this.posts[index].likes.splice(i, 1);
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
        postId: this.posts[index]._id
      };

      let ApiEndPoint = IsLiked == true ? 'deleteDisLike' : 'addDisLike';

      this.apiService.presentLoading();
      this.apiService.postData(dict,ApiEndPoint).subscribe((result) => {
        this.apiService.stopLoading();
        if(result.status == 1){
          if(!IsLiked){
            this.posts[index].dislikes.push(result.data);
            for(var i=0; i < likesArray.length; i++)
            {
              if(likesArray[i].userId == this.userId){
                this.posts[index].likes.splice(i, 1);
              }
            }
          }else{
            for(var i=0; i < dislikesArray.length; i++)
            {
              if(dislikesArray[i].userId == this.userId){
                this.posts[index].dislikes.splice(i, 1);
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
    	this.selectedItemm = -1;
      localStorage.setItem('item', JSON.stringify(post));
      localStorage.setItem('postId', post._id);
      this.router.navigate(['/post-details']);
    }


    viewUser(item){
    	this.selectedItemm = -1;
    	localStorage.setItem('item', JSON.stringify(item));
    	localStorage.setItem('clicked_user_id', item.user_id);
    	this.router.navigate(['/user-profile'])
    }



    //social share 

    async selectSocialShare(item) {
	    const actionSheet = await this.apiService.actionSheetController.create({
	      header: "Share via",
	      buttons: 
	      [{
	            text: 'Whatsapp',
	            handler: () => {
	                this.socialSharing.shareViaWhatsApp(item.description, this.errors.indexOf(item.image) >= 0 ? null : (this.IMAGES_URL + '/IMAGES/' + item.image) , this.errors.indexOf(item.web_link) >= 0 ? null : item.web_link).then((res) => {
					  // Success
					  console.log(res);
					}).catch((e) => {
					  // Error!
					  console.log(e);
					});
	            }
	        },
	        {
	            text: 'Instagram',
	            handler: () => {
	               this.socialSharing.shareViaInstagram(item.description, this.errors.indexOf(item.image) >= 0 ? null : (this.IMAGES_URL + '/IMAGES/' + item.image)).then((res) => {
					  // Success
					}).catch((e) => {
					  // Error!
					});
	            }
	        },
	        {
	            text: 'Facebook',
	            handler: () => {
	              	this.socialSharing.shareViaFacebook(item.description, this.errors.indexOf(item.image) >= 0 ? null : (this.IMAGES_URL + '/IMAGES/' + item.image) , this.errors.indexOf(item.web_link) >= 0 ? null : item.web_link).then((res) => {
					  // Success
					}).catch((e) => {
					  // Error!
					});
	            }
	        },
	        {
	            text: 'Twitter',
	            handler: () => {
	              	this.socialSharing.shareViaTwitter(item.description, this.errors.indexOf(item.image) >= 0 ? null : (this.IMAGES_URL + '/IMAGES/' + item.image) , this.errors.indexOf(item.web_link) >= 0 ? null : item.web_link).then((res) => {
					  // Success
					}).catch((e) => {
					  // Error!
					});
	            }
	        },
	        {
	            text: 'Email',
	            handler: () => {

	              	this.socialSharing.shareViaEmail(item.description, 'Favreet-Share Post', []).then((res) => {
					  // Success
					}).catch((e) => {
					  // Error!
					})
	            }
	        },
	        {
	            text: 'Cancel',
	            role: 'cancel'
	        }
	      ]
	    });
	    await actionSheet.present();
	}


	//edit post
	editPost(item, i){
		console.log(item, i);
		this.selectedItemm = -1;
		localStorage.setItem('postId', item._id);
		localStorage.setItem('route', '/tabs/home');
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
	          this.posts.splice(i, 1);
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
