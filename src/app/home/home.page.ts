import { Component, OnInit , ElementRef, ViewChild, Renderer2,ChangeDetectorRef} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiserviceService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Router } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { MenuController, AlertController, Platform, IonContent, NavController } from '@ionic/angular'; 

import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import * as $ from "jquery";
declare var window: any; 
declare var Branch;
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
// import { AddRecommendService } from '../services/addrecommend.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
	
	authForm: FormGroup;
	selectedItem:any = 'item1';
 	profiletab = "Basic";
  profiletab1: string = "Basic";
	isAndroid: boolean = false;
	posts: any = [];
  allposts: any = [];
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
  selectedItemmShare = -1;
	open = false;
	type = 'Random';
  user_name: any;
  user_image: any;
  user_email: any;
  user_id: any;
	platform1: any;
  categories: any;
  cat: any = "All";
  filter_cat_array = JSON.parse(localStorage.getItem('categoriesCheck'));
  categoriesChecked = JSON.parse(localStorage.getItem('categoriesCheck'));
  categoriesCheck = [];
  @ViewChild(IonContent, {static: true}) content: IonContent;
  noti_count = localStorage.getItem('notiCount');
  index: any = -1;
  play_video = false;
  iframeid: any;
  player: any;
  count = 10;
  start_count = 0;

  	constructor(public sanitizer:DomSanitizer,private ref: ChangeDetectorRef, public apiService: ApiserviceService, public router: Router,private socialSharing: SocialSharing, private menuCtrl: MenuController, private globalFooService: GlobalFooService, public alertController: AlertController,private formBuilder: FormBuilder,private renderer: Renderer2, private iab: InAppBrowser, private platform: Platform/*, private addrecommendService: AddRecommendService*/, public navController: NavController) { 

  		this.createForm();
      this.user_name = localStorage.getItem('user_name');
      this.user_image = localStorage.getItem('user_image');
      this.user_email = localStorage.getItem('user_email');
      this.user_id = localStorage.getItem('userId');
      var self = this;
      self.profiletab = "Basic";

      /*this.addrecommendService.getObservable().subscribe((data) => {
        console.log('Data received', data);
        self.profiletab = "Basic";
        self.counter = 1;
        self.page_number = 1;
        self.is_response = false;
        self.posts = [];
        self.getAllReccomdations(false, '');

      });*/
    
  		this.globalFooService.getObservable().subscribe((data) => {
            console.log('Data received', data, localStorage.getItem('first_login'));
            self.menuCtrl.enable(true);
            self.profiletab = "Basic";
            self.counter = 1;
            self.page_number = 1;
            self.is_response = false;
            self.posts = [];
            self.getAllReccomdations(false, '');
            this.user_name = localStorage.getItem('user_name');
            this.user_image = localStorage.getItem('user_image');
            this.user_email = localStorage.getItem('user_email');
            this.user_id = localStorage.getItem('userId');

            // if(localStorage.getItem('first_login') === 'false'){

             
              
            //   // self.router.navigate(['/category']);
            // }else{
              
            //   self.counter = 1;
            //   self.page_number = 1;
            //   self.is_response = false;
            //   self.posts = [];
            //   self.getAllReccomdations(false, '');
            //   self.updateInfo(data);
            // }           
            
        }); 
  	}

   
    gotToTop() {
      this.content.scrollToTop(1000);
    }

    gotofollowing(){
      var user_id = localStorage.getItem('userId');
      localStorage.setItem('clickUserId' , user_id)
    }

  	ngOnInit() {
      this.platform1 = this.platform.is('cordova');
  	
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
          this.player = new YT.Player('iframe' + index, {
            height: '390',
            width: '640', 
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
         if (document.getElementById('iframe' + index) != undefined) {
          var myImg = document.getElementById('iframe' + index);
          myImg.setAttribute('src', 'https://www.youtube.com/embed/'  + web_link.split('embed/')[1] + '?autoplay=1');

          // document.getElementById('iframe' + index).src =  'https://www.youtube.com/embed/'  + web_link.split('embed/')[1] + '?autoplay=1';
              document.getElementById('iframe' + index).style.display = "block";
              this.iframeid = 'iframe' + index;
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

    getIframeYouTubeUrl(weblink: string): SafeResourceUrl {

        var zz1 = weblink.lastIndexOf('/');
        var zz2 = weblink.substring(zz1+1, weblink.length);
        return this.sanitizer.bypassSecurityTrustResourceUrl(
          "https://www.youtube.com/embed/" + zz2 + "?enablejsapi=1");
    }

     youtube_parser(url){
      var regExp = /^https?\:\/\/(?:www\.youtube(?:\-nocookie)?\.com\/|m\.youtube\.com\/|youtube\.com\/)?(?:ytscreeningroom\?vi?=|youtu\.be\/|vi?\/|user\/.+\/u\/\w{1,2}\/|embed\/|watch\?(?:.*\&)?vi?=|\&vi?=|\?(?:.*\&)?vi?=)([^#\&\?\n\/<>"']*)/i;
      var match = url.match(regExp);
      return  (match && match[1].length==11)? match[1] : false;
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

    catChange(cat, str){

      if(str == 'web'){
        this.counter = 4;
      }
      if(str == 'app'){
        this.counter = 0;
      }

      
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

    viewPostSocial(post, link){
      localStorage.setItem('item', JSON.stringify(post));
      localStorage.setItem('postId', post._id);
      this.iab.create(link, '_system', {location: 'yes', closebuttoncaption: 'done'});
    }

    logout(){
      var categoryCheck = JSON.parse(localStorage.getItem('categoriesCheck'));
      localStorage.clear();
      localStorage.setItem('categoriesCheck', JSON.stringify(categoryCheck));
      this.router.navigate(['/landing-page']);
    }

  	closeUpdate(){
  		this.selectedItemm = -1;
  	}

  	openUpdate(i){
      if(this.selectedItemm == i){
        this.selectedItemm = -1;
      }else{
      this.selectedItemm = i;
      }
  		

  	}
    openUpdateShare(i){
      if(this.selectedItemmShare == i){
        this.selectedItemmShare = -1;
      }else{
      this.selectedItemmShare = i;
      }
      

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

    ngOnDestroy(){
      // alert('leaveccc');
      this.apiService.stopLoading();
      if (this.player === undefined || !this.player || null) {
        console.log("Player could not be found.");
      } else {
        // this.player.stopVideo();
        this.player.destroy();
      }
    }

    ionViewWillLeave() {
      // alert('leave')
      // let listaFrames = document.getElementsByTagName("iframe");
      // for (var index = 0; index < listaFrames.length; index++) {
      //     let iframe = listaFrames[index].contentWindow;          
      //     iframe.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      // }
      if (this.player === undefined || !this.player || null) {
        console.log("Player could not be found.");
      } else {
        // this.player.stopVideo();
        this.player.destroy();
      }
    }

  	ionViewDidEnter(){
      this.count = 10;
      this.noti_count = localStorage.getItem('notiCount');
      console.log('noti = ', this.noti_count)
      var self = this;
      self.profiletab = "Basic";
      // if(localStorage.getItem('first_login') === 'false'){
      //   this.router.navigate(['/category']);
      // }else{
        this.userId = '';
      
        this.counter = 0;
        this.is_response = false;
        this.posts = [];
        this.page_number = 1;
        this.getCategories();
      // }

      // self.counter = 1;
      // self.page_number = 1;
      // self.is_response = false;
      // self.posts = [];
      // self.getAllReccomdations(false, '');
	    
	    this.menuCtrl.enable(true);
	  
  	};

    setFilteredLocations(searchText){

        // this.posts = this.allposts.filter((location) => {
        //   return location.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
        // });

      this.posts = this.allposts.filter(it => {
        return (it.user_name.toLowerCase().includes(searchText) || it.user_name.toUpperCase().includes(searchText) || it.user_name.includes(searchText) || it.category.toLowerCase().includes(searchText)    ||it.category.toUpperCase().includes(searchText)    ||it.category.includes(searchText)    ||   it.sub_category.toLowerCase().includes(searchText)    ||   it.sub_category.toUpperCase().includes(searchText)    ||   it.sub_category.includes(searchText)  || it.title.toLowerCase().includes(searchText)  || it.title.toUpperCase().includes(searchText)  || it.title.includes(searchText) || it.description.toLowerCase().includes(searchText) || it.description.toUpperCase().includes(searchText) || it.description.includes(searchText) );
      });

    }



  	onSegmentChange(e){
      this.profiletab = '';
      console.log('event = ', e.detail.value);
      this.profiletab = e.detail.value;
  		this.counter = 0;
  		this.is_response = false;
	    this.posts = [];
	    this.page_number = 1;
      this.start_count = 0;
      this.count = 10;
      this.ref.detectChanges();
  		this.getAllReccomdations(false, '');
  	}

  	search(){
  		this.counter = 0;
  		this.is_response = false;
	    this.posts = [];
	    this.page_number = 1;
	    this.getAllReccomdations(false, '');
  	}

    updateInfo(data){
      this.user_name = localStorage.getItem('user_name');
      this.user_image = localStorage.getItem('user_image');
      this.user_email = localStorage.getItem('user_email');
      this.user_id = localStorage.getItem('userId');
    }

  	getAllReccomdations(isFirstLoad, event){
  		this.userId = localStorage.getItem('userId');
      console.log('this.profiletab= ', this.profiletab)
      
  		let dict ={
	      user_id: localStorage.getItem('userId'),
	      skip: this.page_number, 
	      limit: this.page_limit,
	      type: this.profiletab,
        cat: this.cat,
	      keyword: this.authForm.value.keyword,
        filter_cat_array: this.filter_cat_array
	    };
	    console.log(dict)
      console.log('this.counter = ', this.counter)
	    if(this.counter != 1){
	    	this.apiService.presentLoading();
	    }
      // if(this.counter == 0){
        // this.apiService.presentLoading();
      // }
	   
	    this.apiService.postData(dict,'getAllRecc').subscribe((result) => {
	      	this.is_response = true;


          if(this.counter == 0){
             //this.apiService.stopLoading();
          }
          if(this.counter == 4){
             //this.apiService.stopLoading();
          }
          this.apiService.stopLoading();
          
	      	console.log(result);
	      	
	      	
	        // this.posts = result.data;

	       //  for (let i = 0; i < result.data.length; i++) {
        //   // loop through the array, moving forwards:
        //   // note in loop below we set `j = i` so we move on after finding greatest value:

          

        //   for (let j = i; j < result.data.length; j++) {

        //   if (parseInt(result.data[i].fav) < parseInt(result.data[j].fav)) {
        //       let temp = result.data[i]; // store original value for swapping
        //       result.data[i] = result.data[j]; // set original value position to greater value
        //       result.data[j] = temp; // set greater value position to original value
        //     };
        //     if (result.data[i].comment_count < result.data[j].comment_count) {
        //       if (result.data[i].comment_count < result.data[j].like_count) {

        //         let temp = result.data[i]; // store original value for swapping
        //         result.data[i] = result.data[j]; // set original value position to greater value
        //         result.data[j] = temp; // set greater value position to original value
        //     }else{
        //       if (result.data[i].like_count < result.data[j].comment_count) {
        //           let temp = result.data[i]; // store original value for swapping
        //           result.data[i] = result.data[j]; // set original value position to greater value
        //           result.data[j] = temp; // set greater value position to original value
        //       };
        //     }
        //     }else if (result.data[i].like_count < result.data[j].like_count) {
        //        if (result.data[i].like_count < result.data[j].comment_count) {
        //         let temp = result.data[i]; // store original value for swapping
        //         result.data[i] = result.data[j]; // set original value position to greater value
        //         result.data[j] = temp; // set greater value position to original value
        //     }else{
        //       if (result.data[i].comment_count < result.data[j].like_count) {

        //           let temp = result.data[i]; // store original value for swapping
        //           result.data[i] = result.data[j]; // set original value position to greater value
        //           result.data[j] = temp; // set greater value position to original value
        //       }
        //     };
        //     };
        //     // if (result.data[i].comment_count < result.data[j].like_count) {
        //     //   let temp = result.data[i]; // store original value for swapping
        //     //   result.data[i] = result.data[j]; // set original value position to greater value
        //     //   result.data[j] = temp; // set greater value position to original value
        //     // }
        //     // if (result.data[i].like_count < result.data[j].comment_count) {
        //     //  let temp = result.data[i]; // store original value for swapping
        //     //   result.data[i] = result.data[j]; // set original value position to greater value
        //     //   result.data[j] = temp; // set greater value position to original value
        //     // };



            
        //   };

          
          
        // };
        // var count = 10;
        this.allposts = result.data;
        console.log('result = ', result);
        console.log(this.posts);
        this.ref.detectChanges();

        if(this.authForm.value.keyword == ''){

          if(result.data.length > 10){
            // this.posts = [];
            if(this.count == result.length){
  	          this.is_response = false;
  	          event.target.complete();
  	        }else{
          
              for (let i = this.start_count; i < this.count; i++) {
                this.posts.push(result.data[i]); 
                this.start_count = i + 1;                      
              }

              if (isFirstLoad)
                event.target.complete();

              this.page_number++;
            }
          }else{
            this.posts = this.allposts;
            // this.is_response = false;
            //event.target.complete();
          }
        }else{
          var searchText = this.authForm.value.keyword;
          this.posts = this.allposts.filter(it => {
            return (it.user_name.toLowerCase().includes(searchText) || it.user_name.toUpperCase().includes(searchText) || it.user_name.includes(searchText) || it.category.toLowerCase().includes(searchText)    ||it.category.toUpperCase().includes(searchText)    ||it.category.includes(searchText)    ||   it.sub_category.toLowerCase().includes(searchText)    ||   it.sub_category.toUpperCase().includes(searchText)    ||   it.sub_category.includes(searchText)  || it.title.toLowerCase().includes(searchText)  || it.title.toUpperCase().includes(searchText)  || it.title.includes(searchText) || it.description.toLowerCase().includes(searchText) || it.description.toUpperCase().includes(searchText) || it.description.includes(searchText) );
          });
        }
	    });
  	}

  	doInfinite(event) {
  		this.counter = 1;
      if((this.allposts.length - this.posts.length) < 10){
        this.count = this.count + (this.allposts.length - this.posts.length);
      }else{
        this.count = this.count + 10;
      }
      
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
          this.ref.detectChanges();
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

  	// like(likesArray,dislikesArray, index){
   //    let IsLiked = false;
   //    let likeId = null;
   //    for(var i=0; i < likesArray.length; i++)
   //    {
   //      if(likesArray[i].userId == localStorage.getItem('userId')){
   //        IsLiked = true;
   //        likeId = likesArray[i]._id;
   //      }
   //    }

   //    let dict = {
   //      userId: this.userId,
   //      _id: likeId,
   //      postId: this.posts[index]._id
   //    };

   //    let ApiEndPoint = IsLiked == true ? 'deleteLike' : 'addLike';

   //    this.apiService.presentLoading();
   //    this.apiService.postData(dict,ApiEndPoint).subscribe((result) => {
   //      this.apiService.stopLoading();
   //      if(result.status == 1){
   //        if(!IsLiked){
   //          this.posts[index].likes.push(result.data);
   //       	for(var i=0; i < dislikesArray.length; i++)
   //          {
   //            if(dislikesArray[i].userId == this.userId){
   //              this.posts[index].dislikes.splice(i, 1);
   //            }
   //          }
   //        }else{
   //          for(var i=0; i < likesArray.length; i++)
   //          {
   //            if(likesArray[i].userId == this.userId){
   //              this.posts[index].likes.splice(i, 1);
   //            }
   //          }
   //        }
   //      }
   //      else{
   //        this.apiService.presentToast('Technical error,Please try after some time.','danger');
   //      }
   //    },
   //    err => {
   //      this.apiService.stopLoading();
   //        this.apiService.presentToast('Technical error,Please try after some time.','danger');
   //    });
   //  };

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
        this.ref.detectChanges();
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
        this.ref.detectChanges();
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

    viewComments(post){
      this.selectedItemm = -1;
      localStorage.setItem('item', JSON.stringify(post));
      localStorage.setItem('postId', post._id);
      this.router.navigate(['/comments']);
    }


    viewUser(item){
    	this.selectedItemm = -1;
    	localStorage.setItem('item', JSON.stringify(item));
    	localStorage.setItem('clicked_user_id', item.user_id);
      localStorage.setItem('add_user_type', item.add_user_type);
    	this.router.navigateByUrl('/user-profile', { replaceUrl: true })
       // this.navController.navigateBack(['user-profile']);
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
    localStorage.setItem('category_id', item.category_id);
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
          this.ref.detectChanges();
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


  ///category area
  getCategories(){

      //this.apiService.presentLoading();
      var dict = {
        user_id: localStorage.getItem('userId')
      }
    
      this.apiService.postData(dict,'categories').subscribe((result) => { 
        //this.apiService.stopLoading();
       this.ref.detectChanges();
        
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
         console.log('this.categories',this.categories);
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


  async presentAlertRadio() {
    const alert = await this.apiService.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Sort By',
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
}
