import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { config } from '../services/config';
import { Router } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { MenuController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

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
	
	hide() {
		this.hideMe = !this.hideMe;
	}

  	constructor(public apiService: ApiserviceService, public router: Router,private socialSharing: SocialSharing, private menuCtrl: MenuController,private formBuilder: FormBuilder) { 

      this.createForm();
    }

  	ngOnInit() {
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
  		this.counter = 0;
  		this.is_response = false;
	    this.posts = [];
	    this.page_number = 1;
	    this.getAllReccomdations(false, '');
	    this.menuCtrl.enable(false);
  	};

  	search(){
  		this.counter = 0;
  		this.is_response = false;
	    this.posts = [];
	    this.page_number = 1;
	    this.getAllReccomdations(false, '');
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
	    if(this.counter == 0){
	    	this.apiService.presentLoading();
	    }
	    
	    this.apiService.postData(dict,'getAllRecc').subscribe((result) => {
	      	this.apiService.stopLoading();
	      	console.log(result);
	      	
	      	this.is_response = true;
	        // this.posts = result;

	        if(result.length == 0){
	          this.is_response = false;
	          event.target.complete();
	        }else{
        
           for (let i = 0; i < result.data.length; i++) {
            this.posts.push(result.data[i]);
          }

        if (isFirstLoad)
          event.target.complete();

        this.page_number++;
      }
	    });
  	}

  	doInfinite(event) {
  		this.counter = 1;
      this.getAllReccomdations(true, event);
    }

    openLink(web_link){
    	window.open(web_link, '_system');
    }

    viewPost(post){
      localStorage.setItem('item', JSON.stringify(post));
      localStorage.setItem('postId', post._id);
      this.router.navigate(['/post-details']);
    }


    viewUser(item){
    	localStorage.setItem('clicked_user_id', item.user_id);
    	this.router.navigate(['/user-profile'])
    }

}
