import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss'],
})
export class LandingPagePage implements OnInit {
    hideMe=false;	
    hideMe1=false;	
	hide() {
		this.hideMe = !this.hideMe;
	}
	hide1() {
		this.hideMe1 = !this.hideMe1;
	}
  constructor() { }

  ngOnInit() {
  }
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
}
