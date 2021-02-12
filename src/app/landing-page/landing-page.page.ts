import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss'],
})
export class LandingPagePage implements OnInit {
  
  hideMe=false;	
  hideMe1=false;	
	
  slideOpts = {
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 1000,
    loop:true,
    autoplay:true,
  }
  slideOpts1 = {
      slidesPerView: 3, 
      spaceBetween: 0,
  	loop:true,
  	speed: 1000,
      autoplay:true,
      breakpoints: {
          1024: {
              slidesPerView: 3, // these don't work
              spaceBetween: 40
          },
          768: {
              slidesPerView: 3,
              spaceBetween: 30
          },
          640: {
              slidesPerView: 2,
              spaceBetween: 20
          },
          320: {
              slidesPerView: 1,
              spaceBetween: 10
          }
      }
  }
  hide() {
    this.hideMe = !this.hideMe;
  }
  hide1() {
    this.hideMe1 = !this.hideMe1;
  }
  categories: any;
  users: any;
  IMAGES_URL: any = config.IMAGES_URL;
  errors = config.errors;
  categoriesCheck = [];
  categoriesChecked = [];

  constructor(public apiService: ApiserviceService, public router: Router, private globalFooService: GlobalFooService) { 

  }

  ngOnInit() {

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

    this.getCategories();
  }

  getCategories(){
      // var dict = {};
      this.apiService.presentLoading();
      var dict = {
        user_id: localStorage.getItem('userId')
      }
    
      this.apiService.postData(dict,'categories').subscribe((result) => { 
        // this.apiService.stopLoading(); 
        console.log(result.data); 
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
        if(result.status == 1){
          
          
        }
        else{
          this.apiService.presentToast('Error while sending request,Please try after some time','success');
        }
        this.getUsers();
      },
      err => {
          this.apiService.presentToast('Technical error,Please try after some time','success');
      });
  }

  getUsers(){

      // this.apiService.presentLoading();
      var dict = {
        user_id: localStorage.getItem('userId')
      }
    
      this.apiService.postData(dict,'recentUsersListWeb').subscribe((result) => { 
        this.apiService.stopLoading(); 
        console.log(result.data); 
        this.users = result.data;
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
            
          }
        }
      ]
    });

    await alert.present();
  }

  goto(){
    if(this.errors.indexOf(localStorage.getItem('userId')) >= 0){
      this.router.navigate(['/login']);
    }else{
      this.router.navigate(['/tabs/home']);
    }
  }
}
