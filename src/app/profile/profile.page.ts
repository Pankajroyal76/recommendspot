import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
	
	profile: any;
	IMAGES_URL: any = config.IMAGES_URL;
	errors = config.errors;
	bgImage: any;
	userId: any;
	data: any;
	loggedUserId: any = localStorage.getItem('userId');
	is_response = false;
  counter = 0;

  	constructor(private globalFooService: GlobalFooService,public apiService: ApiserviceService, public router: Router) { 

      this.globalFooService.getObservable().subscribe((data) => {
          console.log('Data received', data);
          this.counter = 1;
          this.get_profile();
      });
    }

  	ngOnInit() {
  	}

  	ionViewDidEnter(){
      this.counter = 0;
  		this.userId = localStorage.getItem('userId');
  		
  		
  		this.get_profile();
  	}

    gotoFollowersFollowings(str){
      localStorage.setItem('friend', str);
      this.globalFooService.publishSomeData({
          foo: {'data': '', 'page': 'updateprofile'}
      });
      this.router.navigate(['/tabs/following'])
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

  	get_profile(){

	 	let dict ={
	      _id: this.userId
	    };
	    console.log(dict)

      if(this.counter == 0){
        this.apiService.presentLoading();
      }
	    
	    this.apiService.postData(dict,'getProfile').subscribe((result) => {
	     
	      if(result.status == 1){
	      	this.profile = result.data;
	      	this.bgImage = this.errors.indexOf(result.data.cover_image) >= 0 ? '../../assets/img/no-image.png' :  this.IMAGES_URL + '/images/' + result.data.cover_image;
	      	console.log(this.profile);
	      	this.getData();
	      }else{
	      	this.apiService.presentToast(result.msg, 'danger');
	      };
	    });
  	}


  	getData(){
     
      this.apiService.postData({'userId': localStorage.getItem('userId'), 'loggedUserId': localStorage.getItem('userId')},'influencerProfile').subscribe((result) => {
        this.apiService.stopLoading();
        console.log(result)
        if(result.status == 1){
          this.data = result.data;
          this.is_response = true;
          console.log(this.data);
        }
        else{
          this.apiService.presentToast('Technical error,Please try after some time.','danger');
        }
      },
      err => {
        this.apiService.stopLoading();
          this.apiService.presentToast('Technical error,Please try after some time.','danger');
      });
    }

  	goto_profile_setting(){
  		this.router.navigate(['/profile-setting/', this.profile._id]);
  	}

  	like(likesArray, index){
      let IsLiked = false;
      let likeId = null;
      for(var i=0; i < likesArray.length; i++)
      {
        if(likesArray[i].userId == localStorage.getItem('userId')){
          IsLiked = true;
          likeId = likesArray[i]._id;
        }
      }

      let dict = {
        userId: this.userId,
        _id: likeId,
        postId: this.data[index]._id
      };

      let ApiEndPoint = IsLiked == true ? 'deleteLike' : 'addLike';

      this.apiService.presentLoading();
      this.apiService.postData(dict,ApiEndPoint).subscribe((result) => {
        this.apiService.stopLoading();
        if(result.status == 1){
          if(!IsLiked){
            this.data[index].likes.push(result.data);
          }else{
            for(var i=0; i < likesArray.length; i++)
            {
              if(likesArray[i].userId == this.userId){
                this.data[index].likes.splice(i, 1);
              }
            }
          }
        }
        else{
          this.apiService.presentToast('Technical error,Please try after some time.','danger');
        }
      },
      err => {
        this.apiService.stopLoading();
          this.apiService.presentToast('Technical error,Please try after some time.','danger');
      });
    };


    isLikedPost(likesArray){
      //assets/imgs/like.png
      let IsLiked = false;
      if(likesArray.length == 0){

      }else{
      	for(var i=0; i < likesArray.length; i++){
	       
	        if(likesArray[i].userId == this.userId){
	          IsLiked = true;
	        }
	     }
      }
      
      console.log(likesArray)
      if(IsLiked){
        return 'thumbs-up';
      }else{
        return 'thumbs-up-outline';
      }
    }


 	viewPost(post){
      localStorage.setItem('item', JSON.stringify(post));
      localStorage.setItem('postId', post._id);
      this.router.navigate(['/post-details']);
    }


    

  
}
