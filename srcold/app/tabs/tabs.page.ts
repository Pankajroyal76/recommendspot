import { Component } from '@angular/core';
import { GlobalFooService } from '../services/globalFooService.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
	
	str = 'Following';
  	constructor(private globalFooService: GlobalFooService) {

  		if(localStorage.getItem('friend') == 'follower'){
    		this.str = 'Follower';
	    }else{
	    	this.str = 'Following';
	    }

  		this.globalFooService.getObservable().subscribe((data) => {
          console.log('Data received', data);
          	if(localStorage.getItem('friend') == 'follower'){
	    		this.str = 'Follower';
		    }else{
		    	this.str = 'Following';
		    }
      	});
  	}

  	viewProfile(){
  		localStorage.setItem('clicked_user_id', '');
  	}
  	setFollowing(){
  		localStorage.setItem('friend', 'following');
  	}

}
