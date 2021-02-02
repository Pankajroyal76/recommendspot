import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Router } from '@angular/router';
import { Location } from "@angular/common";

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
	categorytab: string = "category";
  	isAndroid: boolean = false;
  	categories: any;
  	
  	constructor(public apiService: ApiserviceService, public router: Router, public location: Location, private globalFooService: GlobalFooService){ }

  	ngOnInit() {

  		
  	}

  	ionViewDidEnter() {

  		this.getCategories();
  	}

  	getCategories(){

  		this.apiService.presentLoading();
  		var dict = {
	    	user_id: localStorage.getItem('userId')
	    }
	  
	    this.apiService.postData(dict,'categories').subscribe((result) => { 
	     this.apiService.stopLoading();  
	     console.log(result.data)
	      if(result.status == 1){
	        this.categories = result.data;	        
	       // this.getData();
	      }
	      else{
	        this.apiService.presentToast('Error while sending request,Please try after some time','success');
	      }
	    },
	    err => {
	        this.apiService.presentToast('Technical error,Please try after some time','success');
	    });
  	}

}
