import { Component, OnInit,ChangeDetectorRef , ViewChild} from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, ToastController, LoadingController , ActionSheetController, AlertController,NavController} from '@ionic/angular';

@Component({
  selector: 'app-add-recommend',
  templateUrl: './add-recommend.page.html',
  styleUrls: ['./add-recommend.page.scss'],
})
export class AddRecommendPage implements OnInit {

	user_name: any;
    user_image: any;
    user_email: any;
    user_id: any;
    IMAGES_URL: any = config.IMAGES_URL;
    errors: any = config.errors;
    noti_count = localStorage.getItem('notiCount');

  	constructor(private ref: ChangeDetectorRef,public apiService: ApiserviceService, public router: Router, private globalFooService: GlobalFooService, public sanitizer:DomSanitizer, public loadingController: LoadingController) { 

  		this.user_name = localStorage.getItem('user_name');
        this.user_image = localStorage.getItem('user_image');
        this.user_email = localStorage.getItem('user_email');
        this.user_id = localStorage.getItem('userId');
        this.globalFooService.getObservable().subscribe((data) => {
            this.user_name = localStorage.getItem('user_name');
            this.user_image = localStorage.getItem('user_image');
            this.user_email = localStorage.getItem('user_email');
            this.user_id = localStorage.getItem('userId');
        });
  	}

  	ngOnInit() {
  	}


  	ionViewDidEnter(){
  		this.noti_count = localStorage.getItem('notiCount');
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

    logout(){
      var categoryCheck = JSON.parse(localStorage.getItem('categoriesCheck'));
      var lat = localStorage.getItem('lat');
      var lng = localStorage.getItem('long');
      localStorage.clear();

      localStorage.setItem('lat', lat);
      localStorage.setItem('long', lng);
      localStorage.setItem('categoriesCheck', JSON.stringify(categoryCheck));
      this.router.navigate(['/landing-page']);
    }


}
