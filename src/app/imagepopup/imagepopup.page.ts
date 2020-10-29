import { Component, OnInit , Input} from '@angular/core';
import { config } from '../services/config';
import { ModalController} from '@ionic/angular'; 

@Component({
  selector: 'app-imagepopup',
  templateUrl: './imagepopup.page.html',
  styleUrls: ['./imagepopup.page.scss'],
})
export class ImagepopupPage implements OnInit {
	
	IMAGES_URL: any = config.IMAGES_URL;
	@Input() image: string;

  	constructor(public modalController: ModalController) { }

  	ngOnInit() {
  		console.log(this.image);
  	}

  	dismiss() {
	    // using the injected ModalController this page
	    // can "dismiss" itself and optionally pass back data
	    this.modalController.dismiss({
	      'dismissed': true
	    });
	}

}
