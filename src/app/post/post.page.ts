import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { config } from '../services/config';
import { Router } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { MenuController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
declare var Branch;
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
	
  authForm: FormGroup;
  hideMe=false;
	selectedItem:any = 'item1';
 	profiletab: string = "Basic";
	isAndroid: boolean = false;
	posts: any = [];
	is_response = false;
	IMAGES_URL: any = config.IMAGES_URL;
	errors = config.errors;
	page_number = 1;
	page_limit = 10;
	userId = localStorage.getItem('userId');	
	counter = 0;
	keyword = '';
  type = 'Random';
	
	hide() {
		this.hideMe = !this.hideMe;
	}

  	constructor(public apiService: ApiserviceService, public router: Router,private socialSharing: SocialSharing, private menuCtrl: MenuController,private formBuilder: FormBuilder, private iab: InAppBrowser) { 

      this.createForm();
    }

  	ngOnInit() {

      this.counter = 0;
      this.is_response = false;
      this.posts = [];
      this.page_number = 1;
      this.getAllReccomdations(false, '');
  	}

    //define the validators for form fields
    createForm(){
      this.authForm = this.formBuilder.group({
        keyword: ['', Validators.compose([Validators.required])]
      });
    };

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

  	gotoLogin(){
  		var self = this;
  		this.apiService.presentToast('Please login to add new reccomandations', 'danger');
  		

  		setTimeout(function(){ self.router.navigate(['/login']); }, 4000);
  		
  	}

  	ionViewDidEnter(){
  		
	    this.menuCtrl.enable(false);
  	};

  	search(){
  		this.counter = 0;
  		this.is_response = false;
	    this.posts = [];
	    this.page_number = 1;
	    this.getAllReccomdations(false, '');
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


  	getAllReccomdations(isFirstLoad, event){

  		let dict ={
	      user_id: localStorage.getItem('userId'),
	      skip: this.page_number, 
	      limit: this.page_limit,
	      type: this.profiletab,
	      keyword: this.authForm.value.keyword
	    };
	    console.log(dict)
	    if(this.counter == 0 && this.errors.indexOf(this.userId) >= 0){
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
