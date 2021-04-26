import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { config } from '../services/config';
import { Router } from '@angular/router';
import { GlobalFooService } from '../services/globalFooService.service';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Platform, MenuController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';


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
	authForm: FormGroup;

  	constructor(private ref: ChangeDetectorRef,private fcm: FCM,public apiService: ApiserviceService, public router: Router,private globalFooService: GlobalFooService, private fb: Facebook, private googlePlus: GooglePlus, public fireAuth: AngularFireAuth, private platform: Platform,private formBuilder: FormBuilder) { 
  		this.createForm();
  		this.reg_exp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  		this.withoutspace = /^\S*$/;
  	}

  	ngOnInit() {
  	console.log(this.platform)
  	}

  	//define the validators for form fields
  	createForm(){
	    this.authForm = this.formBuilder.group({
	      email: ['', Validators.compose([Validators.required])],
	      password: ['', Validators.compose([Validators.required])]
	    });
  	};

  	ionViewDidEnter(){

  		this.fcm.getToken().then(token => {
  			this.fcm_token = token;
  		});
  	}

  	login(){

	    this.is_submit = true;
	    if(this.errors.indexOf(this.authForm.value.email) >= 0 || this.errors.indexOf(this.authForm.value.password) >= 0 || !this.reg_exp.test(String(this.authForm.value.email)) || !this.withoutspace.test(this.authForm.value.password) ){
	      return false;
	    }

	    let dict ={
	      email: this.authForm.value.email,
	      password: this.authForm.value.password,
	      fcm_token: this.fcm_token
	    };
	    console.log(dict)

	    //this.apiService.presentLoading();
	    this.apiService.postData(dict,'loginUser').subscribe((result) => {
	      this.apiService.stopLoading();
	      this.ref.detectChanges();
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
	      	//this.apiService.navCtrl.navigateRoot('tabs/home');
	      	if(result.data.first_login == 'true'){
	      		this.apiService.navCtrl.navigateRoot('tabs/home');
	      	}else{
	      		this.apiService.navCtrl.navigateRoot('/category');
	      	}
	      }else{

	      	this.apiService.presentToast(result.error, 'danger');
	      };
	    });

	};

	fbLogin() {
        //this.loginType = 'Login with Facebook'
       // return this.fireAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());

        const provider = new firebase.auth.FacebookAuthProvider();
    	this.fireAuth.auth.signInWithPopup(provider)
        .then((result) => {
        	console.log('Signin result', result);
        	// if(this.errors.indexOf(result) == -1){
	          	let dict ={
		            name: result.additionalUserInfo.profile['name'],
		            email: result.additionalUserInfo.profile['email'],
		            password: '',
		            medium: 'facebook',
		            social_id: result.additionalUserInfo.profile['id'],
		            image: result.additionalUserInfo.profile['picture']['data']['url'],
		            fcm_token: this.fcm_token,
		            contact: ''
		        };
          		console.log('dict', dict);
          		this.finalSignup(dict); 

        	// }else{
         //  		this.apiService.presentToast('Error,Please try after some time', 'danger')
        	// }

        	})
        .catch((error) => console.error('Sigin error', error));
    };

    gglLogin(){
        //this.loginType = 'Login with Facebook'
       // return this.fireAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());

        const provider = new firebase.auth.GoogleAuthProvider();
    	this.fireAuth.auth.signInWithPopup(provider)
        .then((result) => {
        	console.log('Signin result', result);
        	// if(this.errors.indexOf(result) == -1){
	          	let dict ={
			            name: result.additionalUserInfo.profile['name'],
			            email: result.user.email,
			            password: '',
			            medium: 'google',
			            social_id: result.additionalUserInfo.profile['id'],
			            image: !result.additionalUserInfo.profile['picture'] ? '' : result.additionalUserInfo.profile['picture'],
			            fcm_token: this.fcm_token,
			            contact: ''
		          	};
          		console.log('dict', dict);
          		this.finalSignup(dict); 

        	// }else{
         //  		this.apiService.presentToast('Error,Please try after some time', 'danger')
        	// }

        	})
        .catch((error) => console.error('Sigin error', error));
    };

	//Facebook login
 	facebookLogin(){
 	
	 	if (this.platform.is('cordova')) {	
    
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
			            contact: '',
			            location: '',
			            website: '',

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
      	}else{
      		this.fbLogin();
	 	}
	};



	 //Google social login 
	googleLogin(){
	    console.log(this.googlePlus)
	    if (this.platform.is('cordova')) {	
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
			            contact: '',
			            location: '',
			            website: '',
		          	};
		          	console.log('dict', dict);

		          	
		         	this.finalSignup(dict);             
		      	}

		    })
		    .catch(err => {
		    	console.error(err)
		    	this.apiService.presentToast( 'Error,Please try after some time', 'danger');
		    });
		}else{
			this.gglLogin();
		}

	    
	};

	finalSignup(dict){
	    this.apiService.presentLoading();
	    // this.fcm.getToken().then(token => {
	    this.apiService.postData(dict,'social_login').subscribe((result) => {
	      this.apiService.stopLoading();
	      this.ref.detectChanges();
	      this.globalFooService.publishSomeData({
            	foo: {'data': result.data, 'page': 'profile'}
        	});
	      if(result.status == 1){
	        this.apiService.presentToast('Login successfully!', 'success');
	      	

	  	 	localStorage.setItem('userId', result.data._id);
        	localStorage.setItem('IsLoggedIn', 'true');
        	localStorage.setItem('profile',JSON.stringify(result.data));
        	localStorage.setItem('user_name', result.data.name);
  			localStorage.setItem('user_image', result.data.image);
  			if(this.errors.indexOf(result.data.email) >= 0){
  				localStorage.setItem('user_email', '');
  			}else{
  				localStorage.setItem('user_email', result.data.email);
  			}
  			
  			localStorage.setItem('user_medium', result.data.medium);
  			localStorage.setItem('first_login', result.data.first_login);
	      	if(result.data.first_login == true){
	      		this.apiService.navCtrl.navigateRoot('tabs/home');
	      	}else{
	      		this.apiService.navCtrl.navigateRoot('/category');
	      	}
        	
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
