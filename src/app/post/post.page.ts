import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { config } from '../services/config';
import { Router } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { MenuController, Platform } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
declare var Branch;
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
declare var window: any; 
  const share = {
    displayNames: true,
    config: [{
          facebook: {
            socialShareUrl: 'https://peterpeterparker.io'
          }
        },{
          twitter: {
            socialShareUrl: 'https://peterpeterparker.io'
          }
    }]
};
const navigator = window.navigator as any;

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
	
  
  authForm: FormGroup;
  hideMe=false;
	selectedItem:any = 'item1';
 	profiletab: string = "Today";
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
  platform1: any;
  showBtn: boolean = false;
  deferredPrompt: any;
	categories: any;
  cat: any = "All";
  filter_cat_array = [];
  categoriesCheck = [];
  categoriesChecked = JSON.parse(localStorage.getItem('categoriesCheck'));

	hide() {
		this.hideMe = !this.hideMe;
	}

  	constructor(public apiService: ApiserviceService, public router: Router,private socialSharing: SocialSharing, private menuCtrl: MenuController,private formBuilder: FormBuilder, private iab: InAppBrowser, private platform: Platform) { 

      this.createForm();
    }


 
  add_to_home(e){
    //debugger
    // hide our user interface that shows our button
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          alert('User accepted the prompt');
        } else {
          alert('User dismissed the prompt');
        }
        this.deferredPrompt = null;
      });
  };

	ngOnInit() {

    // this.counter = 0;
    // this.is_response = false;
    // this.posts = [];
    // this.page_number = 1;
    // this.platform1 = this.platform.is('cordova');
    // console.log(this.platform);
    // this.getAllReccomdations(false, '');
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
      this.getCategories();
       
  }

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

  catChange(cat, str){

      if(str == 'web'){
        this.counter = 4;
      }
      if(str == 'app'){
        this.counter = 0;
      }

      
    this.counter = 0;
    this.is_response = false;
    this.posts = [];
    this.page_number = 1;
    this.platform1 = this.platform.is('cordova');
    console.log(this.platform);
    this.getAllReccomdations(false, '');
  }

  getCategories(){

      //this.apiService.presentLoading();
      var dict = {
        user_id: localStorage.getItem('userId')
      }
    
      this.apiService.postData(dict,'categories').subscribe((result) => { 
        //this.apiService.stopLoading();
        console.log('this.categories', result.data)  

        for(var i = 0; i < result.data.length; i++){
          if(this.filter_cat_array.indexOf(result.data[i]._id) >= 0){
            result.data[i].checked = true;
          }else{
            result.data[i].checked = false;
          }
          
        }
        this.categories = result.data;

        for(var i = 0; i < result.data.length; i++){

          var dict = {
            name: result.data[i].name,
            type: 'checkbox',
            label: result.data[i].name,
            value: result.data[i]._id,
            checked: false
          };
          this.categoriesCheck.push(dict);
        }

        this.categories = result.data;
        // this.cat = this.categories[0]._id;
        this.getAllReccomdations(false, '');
        if(result.status == 1){
         
        }
        else{
          this.apiService.presentToast('Error while sending request,Please try after some time','success');
        }
      },
      err => {
          this.apiService.presentToast('Technical error,Please try after some time','success');
      });
    }


	getAllReccomdations(isFirstLoad, event){

		let dict ={
      user_id: localStorage.getItem('userId'),
      skip: this.page_number, 
      cat: this.cat, 
      limit: this.page_limit,
      type: 'Today',
      keyword: this.authForm.value.keyword,
      filter_cat_array: this.filter_cat_array
    };
    console.log(dict)
    if(this.counter == 0 && this.errors.indexOf(this.userId) >= 0){
    	//this.apiService.presentLoading();
    }
    this.apiService.presentLoading();
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


  viewPost(post){
    localStorage.setItem('item', JSON.stringify(post));
    localStorage.setItem('postId', post._id);
    this.router.navigate(['/post-details']);
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


  viewUser(item){
    localStorage.setItem('item', JSON.stringify(item));
  	localStorage.setItem('clicked_user_id', item.user_id);
  	this.router.navigate(['/user-profile'])
  }


    //scoial share 
  socialsharebranch(post){
    if (navigator.share) {
      navigator
        .share({
          title: 'Google',
          text: 'Save',
          url: 'https://google.com'
        })
        .then(() => console.log('Successful share'))
        .catch(error => console.log('Error sharing', error));
    } else {
      alert('share not supported');
    }
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

  selectCat(cat){
      console.log(cat);
      if(this.filter_cat_array.indexOf(cat._id) == -1){
        this.filter_cat_array.push(cat._id);
      }else{
        this.filter_cat_array.splice(this.filter_cat_array.indexOf(cat._id),1);
      }

      localStorage.setItem('categoriesCheck', JSON.stringify(this.filter_cat_array));

      this.getAllReccomdations(false, '');

      console.log(this.filter_cat_array);
      
    }

  async presentAlertRadio() {
    const alert = await this.apiService.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Radio',
      inputs: [
        {
          name: 'Saved',
          type: 'radio',
          label: 'Saved',
          value: 'Saved',
          checked: this.type == 'Saved' ? true : false
        },
        {
          name: 'Likes',
          type: 'radio',
          label: 'Likes',
          value: 'Likes',
          checked: this.type == 'Likes' ? true : false
        },
        {
          name: 'Comments',
          type: 'radio',
          label: 'Comments',
          value: 'Comments',
          checked: this.type == 'Comments' ? true : false
        },
        {
          name: 'Random',
          type: 'radio',
          label: 'Random',
          value: 'Random',
          checked: this.type == 'Random' ? true : false
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok', data);
            this.typeChange(data);
            this.type = data;
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlert() {
    const alert = await this.apiService.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Categories',
      inputs: this.categoriesCheck,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok', data);
            this.categoriesChecked = data;
            for(var i = 0; i < this.categoriesCheck.length; i++){
              if(data.indexOf(this.categoriesCheck[i].value) >= 0){
                this.categoriesCheck[i].checked = true;
              }else{
                this.categoriesCheck[i].checked = false;
              }
            }
            localStorage.setItem('categoriesCheck', JSON.stringify(this.categoriesChecked))
            this.filter_cat_array = JSON.parse(localStorage.getItem('categoriesCheck'));
            this.getAllReccomdations(false, '');
          }
        }
      ]
    });

    await alert.present();
  }

}
