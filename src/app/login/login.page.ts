import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { config } from '../services/config';
import { Router } from '@angular/router';
import { GlobalFooService } from '../services/globalFooService.service';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	
	email: any;
	password: any;
	is_submit: Boolean = false;
	errors = config.errors;
	reg_exp: any;
	fcm_token: any;
	withoutspace: any;

  	constructor(private fcm: FCM,public apiService: ApiserviceService, public router: Router,private globalFooService: GlobalFooService, private fb: Facebook, private googlePlus: GooglePlus) { 

  		this.reg_exp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  		this.withoutspace = /^\S*$/;
  	}

  	ngOnInit() {
  	}

  	ionViewDidEnter(){

  		this.fcm.getToken().then(token => {
  			this.fcm_token = token;
  		});
  	}

  	login(){

	    this.is_submit = true;
	    if(this.errors.indexOf(this.email) >= 0 || this.errors.indexOf(this.password) >= 0 || !this.reg_exp.test(String(this.email)) || !this.withoutspace.test(this.password) ){
	      return false;
	    }

	    let dict ={
	      email: this.email,
	      password: this.password,
	      fcm_token: this.fcm_token
	    };
	    console.log(dict)

	    this.apiService.presentLoading();
	    this.apiService.postData(dict,'loginUser').subscribe((result) => {
	      this.apiService.stopLoading();

	      if(result.status == 1){
	      	this.apiService.presentToast(result.error, 'success');

	      	localStorage.setItem('userId', result.data._id);
        	localStorage.setItem('IsLoggedIn', 'true');
        	localStorage.setItem('profile',JSON.stringify(result.data));
        	localStorage.setItem('user_name', result.data.name);
  			localStorage.setItem('user_image', result.data.image);
  			localStorage.setItem('user_email', result.data.email);
  			localStorage.setItem('user_medium', result.data.medium);
  			this.globalFooService.publishSomeData({
            	foo: {'data': result.data, 'page': 'profile'}
        	});
	      	// this.router.navigate(['tabs/home'])
	      	this.apiService.navCtrl.navigateRoot('tabs/home');
	      }else{

	      	this.apiService.presentToast(result.error, 'danger');
	      };
	    });

	};

	//Facebook login
 	facebookLogin(){
    
    	this.fb.login(['public_profile', 'email']).then((res: FacebookLoginResponse) => 
	     	this.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
	        console.log('profile', profile);     
	        	if(this.errors.indexOf(profile) == -1){
		          	let dict ={
			            name: profile['name'],
			            email: profile['email'],
			            password: '',
			            medium: 'facebook',
			            social_id: profile['id'],
			            image: profile['picture_large']['data']['url'],
			            fcm_token: this.fcm_token,
			            contact: ''
			        };
	          		console.log('dict', dict);
	          		this.finalSignup(dict); 

        	}else{
          		this.apiService.presentToast('Error,Please try after some time', 'danger')
        	}
      	})
      	).catch(e => {
          this.apiService.presentToast( 'Error,Please try after some time', 'danger');
          console.log(e)
      	});
	};



	 //Google social login 
	googleLogin(){
	    console.log(this.googlePlus)
	    this.googlePlus.login({'scopes': 'profile'})
	    .then(profile => {
	      	console.log(profile);
	      	if(this.errors.indexOf(profile) == -1){
	          	let dict ={
		            name: profile['displayName'],
		            email: profile['email'],
		            password: '',
		            medium: 'google',
		            social_id: profile['userId'],
		            image: !profile['imageUrl'] ? '' : profile['imageUrl'],
		            fcm_token: this.fcm_token,
		            contact: ''
	          	};
	          	console.log('dict', dict);

	          	
	         	this.finalSignup(dict);             
	      	}

	    })
	    .catch(err => {
	    	console.error(err)
	    	this.apiService.presentToast( 'Error,Please try after some time', 'danger');
	    });
	};

	finalSignup(dict){
	    this.apiService.presentLoading();
	    // this.fcm.getToken().then(token => {
	    this.apiService.postData(dict,'social_login').subscribe((result) => {
	      this.apiService.stopLoading();

	      if(result.status == 1){
	        this.apiService.presentToast('Login successfully!', 'success');
	      	

	  	 	localStorage.setItem('userId', result.data._id);
        	localStorage.setItem('IsLoggedIn', 'true');
        	localStorage.setItem('profile',JSON.stringify(result.data));
        	localStorage.setItem('user_name', result.data.name);
  			localStorage.setItem('user_image', result.data.image);
  			localStorage.setItem('user_email', result.data.email);
  			localStorage.setItem('user_medium', dict.medium);
  			this.globalFooService.publishSomeData({
            	foo: {'data': result.data, 'page': 'profile'}
        	});
        	this.apiService.navCtrl.navigateRoot('tabs/home');
	      }
	      else{
	        this.apiService.presentToast('Error while signing up! Please try later', 'danger');
	      }
	    },
	    err => {
	      this.apiService.stopLoading();
	        this.apiService.presentToast('Technical error,Please try after some time', 'danger');
	    });
	    // });
	};


}
