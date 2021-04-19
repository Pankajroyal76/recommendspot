import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { config } from '../services/config';
import { Router } from '@angular/router';


@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {
	
	email: any;
	is_submit: Boolean = false;
	errors = config.errors;
	reg_exp: any;
	withoutspace: any;

  	constructor(private ref: ChangeDetectorRef,public apiService: ApiserviceService, public router: Router) { 

  		this.reg_exp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  		

  	}

  	ngOnInit() {
  	}

  
  	forgot_password(){
	    this.is_submit = true;

	    if(this.errors.indexOf(this.email) >= 0 || !this.reg_exp.test(String(this.email).toLowerCase())){
	      return false;
	    };

	    let dict ={
	      email: this.email
	    };
	    console.log(dict)

	    this.apiService.presentLoading();
	    this.apiService.postData(dict,'forgotPassword').subscribe((result) => {
	      this.apiService.stopLoading();
	      this.ref.detectChanges();
	      if(result.status == 1){
	      	this.apiService.presentToast(result.msg, 'success');
	      	this.router.navigate(['/login']);
	      }else{
	      	this.apiService.presentToast(result.msg, 'danger');
	      };
	    });
	    
	};

}
