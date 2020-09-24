import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GlobalFooService } from './services/globalFooService.service';
import { config } from './services/config';
import { Router } from '@angular/router';
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

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private globalFooService: GlobalFooService,
    private router: Router,
    private menuCtrl: MenuController
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

  

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.branchInit();

      if(this.errors.indexOf(localStorage.getItem('userId')) >= 0){
        this.router.navigate(['/'])
      }else{
        this.router.navigate(['/tabs/home'])

      }
    });
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/']);
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

