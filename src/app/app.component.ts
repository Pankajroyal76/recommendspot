import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GlobalFooService } from './services/globalFooService.service';
import { ApiserviceService } from './services/apiservice.service';
import { config } from './services/config';
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';

declare var Branch;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
	 public appPages = [
	 {
      title: 'Home',
      url: '/tabs/home',
      icon: 'home-outline'
    },
	{
      title: 'Notifications',
      url: '/tabs/notification',
      icon: 'notifications-outline'
    },
	{
      title: 'Profile',
      url: '/tabs/profile',
      icon: 'person-outline'
    },
	{
      title: 'Logout',
      url: '/',
      icon: 'log-out-outline'
    }
  ];
  user_name = localStorage.getItem('user_name');
  user_image = localStorage.getItem('user_image');
  user_email = localStorage.getItem('user_email');
  user_medium = localStorage.getItem('user_medium');
  IMAGES_URL: any = config.IMAGES_URL;
  errors = config.errors;
  selectedIndex: any;
  showBtn: boolean = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private globalFooService: GlobalFooService,
    private router: Router,
    private menuCtrl: MenuController,
    private fcm: FCM,
    public apiService: ApiserviceService
    ) {
    this.initializeApp();

    this.globalFooService.getObservable().subscribe((data) => {
            console.log('Data received', data);
            this.user_name = localStorage.getItem('user_name');
            this.user_image = localStorage.getItem('user_image');
            this.user_email = localStorage.getItem('user_email');
            this.user_medium = localStorage.getItem('user_medium');

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

  gotoRoute(url){
    this.apiService.navCtrl.navigateRoot(url);
  }

  initializeApp() {


  let deferredPrompt;
 
    
    this.platform.ready().then(() => {
      //this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#f16334');
      this.splashScreen.hide();

     if (!this.apiService.gettoken()) {
        this.router.navigate([""]);
      } else {
        this.router.navigate(["/tabs/home"]);
      }

      
      this.branchInit();
      this.fcmNotification();

      
    });

    this.platform.resume.subscribe(() => {
      this.branchInit();
      this.fcmNotification();
    });
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/']);
  }


  fcmNotification(){
    var self = this;
    this.fcm.onNotification().subscribe(data => {
      console.log(data);


      if (data.wasTapped) {
        console.log('Received in background');
        setTimeout(function(){
          if(JSON.parse(data.type) == 'add post' || JSON.parse(data.type) == 'add like' || JSON.parse(data.type) == 'add comment'){
              if(self.errors.indexOf(localStorage.getItem('userId')) >= 0){
                self.router.navigate(['/login']);
              }else{
                localStorage.setItem('item',  data.item);
                localStorage.setItem('postId', data.itemId);
                self.router.navigate(['/post-details']);
              }
            
          }else if(JSON.parse(data.type) == 'follow user'){
            localStorage.setItem('item', data.item);
            localStorage.setItem('clicked_user_id', data.itemId);
            self.router.navigate(['/user-profile'])
          }
        },2000);

       
        
      } else {
        console.log('Received in foreground');
        // this.presentAlertConfirm();
      }


      
    });
  }


  branchInit = () => {
    var ptr = this;
    // only on devices
    // const Branch = window['Branch'];

    // for development and debugging only
    Branch.setDebug(true); 

    // Branch initialization within your deviceready and resume
    Branch.initSession()
      .then(function success(data) {
        // alert("Open app with a Branch deep link: " + JSON.stringify(res));
        if (data["+clicked_branch_link"]) {

          //save the link clicked data into localstorage of the app.
          localStorage.setItem('clickedData', JSON.stringify(data));

          console.log(data);

          setTimeout(function(){
          
            localStorage.setItem('item',  data.post);
            localStorage.setItem('postId', data.postId);
            ptr.router.navigate(['/post-details']);

          },2000); 

        } else if (data["+non_branch_link"]) {
          //alert("Open app with a non Branch deep link: " + JSON.stringify(data));
        } else {
          // alert("Open app organically");
          // Clicking on app icon or push notification
        }
      })
    .catch(function error(err) {
    });
  };
}

