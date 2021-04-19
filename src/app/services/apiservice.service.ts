import { Injectable } from '@angular/core';
import { Http, Headers, Response,RequestOptions, RequestOptionsArgs } from '@angular/http';
import { ModalController, ToastController, LoadingController , ActionSheetController, Platform, AlertController,NavController} from '@ionic/angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs/Observable';
import { config } from './config';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {

  loading:any;
  isLoggedIn:Boolean;
  errors = config.errors;

  constructor(public modalController: ModalController, private http: Http, public router: Router, public toastController: ToastController, public loadingController: LoadingController,  public actionSheetController: ActionSheetController, public platform: Platform, public alertController: AlertController, public navCtrl: NavController) { }


  gettoken() {
    return !!localStorage.getItem('userId');
  }

  checkUserToken(){
    var token = localStorage.getItem('apart_auth_token');
    var userId = this.decryptData(token,config.ENC_SALT);
    console.log('sadsds');
    this.postData({userId: userId},'check_user_token').subscribe((result) => {
      if(result.status == 1){
        this.isLoggedIn = true;
      }
      else{
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
      }
    });
  }

  postData(data,endpoint){

    return this.http.post(endpoint , data).map((responseData) => {
        return responseData.json();
    }, error => {
     	return error.json();
  	});
  }

  getData(endpoint){
    return this.http.get(endpoint).map((responseData) => {
        return responseData.json();
    }).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
  }


  async presentToast(message,color) {
   



    const toast = await this.toastController.create({
	  message: message,
	  position: 'bottom',
	  color: color,
	  duration: 3000,
	  buttons: [
	    {
	      text: 'close',
	      role: 'cancel',
	      handler: () => {
	        console.log('Cancel clicked');
	      }
	    }
	  ]
	});
	toast.present();
  }

  async presentLoading() {
   // this.loading = await this.loadingController.create();
   console.log('loading = ', this.errors.indexOf(this.loading))
    if (this.errors.indexOf(this.loading) >= 0) {
        this.loading = await this.loadingController.create({ 
          spinner: 'bubbles', cssClass: 'my-loading-class'});
    }
    await this.loading.present();
  }

  async stopLoading() {
    if (this.errors.indexOf(this.loading) == -1) {
      await this.loading.dismiss();
      this.loading  = null;
    }
    else{
      var self = this;
      setTimeout(function(){
        self.stopLoading();
      },1000);
    }
  }

  encryptData(data,salt) {
      try {
          var enc = CryptoJS.AES.encrypt(JSON.stringify(data), salt).toString();
          enc = enc.split('+').join('xMl3Jk').split('/').join('Por21Ld').split('=').join('Ml32');
          return enc;
      } catch (e) {
          return 0;
      }
  }

  decryptData(data,salt) {
      try { 
          data = data.split('xMl3Jk').join('+').split('Por21Ld').join('/').split('Ml32').join('=');
          const bytes = CryptoJS.AES.decrypt(data, salt);
          if (bytes.toString()) {
              var dec = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
              return dec;
          }
          return data;
      } catch (e) {
          return 0;
      }
  }

 
}
