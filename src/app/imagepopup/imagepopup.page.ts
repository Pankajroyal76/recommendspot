import { Component, OnInit , Input} from '@angular/core';
import { config } from '../services/config';
import { ModalController, NavParams} from '@ionic/angular'; 

@Component({
  selector: 'app-imagepopup',
  templateUrl: './imagepopup.page.html',
  styleUrls: ['./imagepopup.page.scss'],
})
export class ImagepopupPage implements OnInit {
	
	IMAGES_URL: any = config.IMAGES_URL;
	@Input() image: string;
	image_value : any;

  	constructor(public modalController: ModalController,public navParams: NavParams) { 

  		this.image_value = navParams.get('value');
  		console.log(this.image_value)

  	}

  	ngOnInit() {
  		console.log(this.image_value);
  	}

  	dismiss() {
	    // using the injected ModalController this page
	    // can "dismiss" itself and optionally pass back data
	    this.modalController.dismiss({
	      'dismissed': true
	    });
	}

}
