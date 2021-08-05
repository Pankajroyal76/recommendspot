import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ApiserviceService } from "../services/apiservice.service";
import { GlobalFooService } from "../services/globalFooService.service";
import { config } from "../services/config";
import { Router } from "@angular/router";
import { Platform, MenuController } from "@ionic/angular";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import { GooglePlus } from "@ionic-native/google-plus/ngx";

@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.page.html",
  styleUrls: ["./landing-page.page.scss"],
})
export class LandingPagePage implements OnInit {
  hideMe = false;
  hideMe1 = false;

  slideOpts = {
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 1000,
    loop: false,
    autoplay: false,
    onlyExternal: false,
    noSwipingClass: "swiper-no-swiping",
  };
  slideOpts1 = {
    slidesPerView: 3,
    spaceBetween: 0,
    loop: false,
    speed: 1000,
    autoplay: false,
    breakpoints: {
      1024: {
        slidesPerView: 3, // these don't work
        spaceBetween: 40,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
    },
  };

  fcm_token: any;
  allposts: any[];
  posts: any[];
  profiletab1: any;
  filter_cat_array_global: any[];

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

  slideOpts2 = {
    autoWidth: true,
    slidesPerView: 2.25,
    spaceBetween: 10,
    speed: 400,
    breakpoints: {
      767: { autoWidth: true, slidesPerView: 4, spaceBetween: 15 },
      1024: { autoWidth: true, slidesPerView: 4, spaceBetween: 15 },
    },
  };
  constructor(
    private ref: ChangeDetectorRef,
    public apiService: ApiserviceService,
    public router: Router,
    private globalFooService: GlobalFooService,
    private platform: Platform,
    public fireAuth: AngularFireAuth,
    private fb: Facebook,
    private googlePlus: GooglePlus
  ) {}

  ngOnInit() {}

  getimage(img) {
    if (this.errors.indexOf(img) == -1) {
      if (img.includes("https") == true) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  ionViewDidEnter() {
    this.getCategories();
  }

  selectCatForGlobalFeed(cat, i) {
    console.log(cat, i);
    this.allposts = [];
    this.posts = [];
    this.ref.detectChanges();
    if (i == "Today" || i == "Basic") {
      this.profiletab1 = i;
      this.filter_cat_array_global = [];
    } else {
      this.profiletab1 = "";
      this.filter_cat_array_global = [];
      if (this.filter_cat_array_global.indexOf(cat._id) == -1) {
        this.filter_cat_array_global.push(cat._id);
      } else {
        this.filter_cat_array_global.splice(
          this.filter_cat_array_global.indexOf(cat._id),
          1
        );
      }
    }
  }

  getCategories() {
    // var dict = {};
    // this.apiService.presentLoading();
    var dict = {
      user_id: localStorage.getItem("userId"),
    };

    this.apiService.postData(dict, "categories").subscribe(
      (result) => {
        // this.apiService.stopLoading();
        console.log(result.data);
        this.ref.detectChanges();
        this.categories = result.data;
        for (var i = 0; i < result.data.length; i++) {
          var dict = {
            name: result.data[i].name,
            type: "checkbox",
            label: result.data[i].name,
            value: result.data[i]._id,
            checked: false,
          };
          this.categoriesCheck.push(dict);
        }
        if (result.status == 1) {
        } else {
          this.apiService.presentToast(
            "Error while sending request,Please try after some time",
            "success"
          );
        }
        this.getUsers();
      },
      (err) => {
        this.apiService.presentToast(
          "Technical error,Please try after some time",
          "success"
        );
      }
    );
  }

  getUsers() {
    // this.apiService.presentLoading();
    var dict = {
      user_id: localStorage.getItem("userId"),
    };

    this.apiService.postData(dict, "recentUsersListWeb").subscribe(
      (result) => {
        this.ref.detectChanges();
        this.apiService.stopLoading();
        console.log(result.data);
        this.users = result.data;
        if (result.status == 1) {
        } else {
          this.apiService.presentToast(
            "Error while sending request,Please try after some time",
            "success"
          );
        }
      },
      (err) => {
        this.apiService.presentToast(
          "Technical error,Please try after some time",
          "success"
        );
      }
    );
  }

  async presentAlert() {
    const alert = await this.apiService.alertController.create({
      cssClass: "my-custom-class",
      header: "Categories",
      inputs: this.categoriesCheck,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          },
        },
        {
          text: "Ok",
          handler: (data) => {
            console.log("Confirm Ok", data);
            this.categoriesChecked = data;
            for (var i = 0; i < this.categoriesCheck.length; i++) {
              if (data.indexOf(this.categoriesCheck[i].value) >= 0) {
                this.categoriesCheck[i].checked = true;
              } else {
                this.categoriesCheck[i].checked = false;
              }
            }
            localStorage.setItem(
              "categoriesCheck",
              JSON.stringify(this.categoriesChecked)
            );
          },
        },
      ],
    });

    await alert.present();
  }

  goto() {
    if (this.errors.indexOf(localStorage.getItem("userId")) >= 0) {
      this.router.navigate(["/login"]);
    } else {
      this.router.navigate(["/tabs/home"]);
    }
  }

  //Facebook login
  facebookLogin() {
    if (this.platform.is("cordova")) {
      this.fb
        .login(["public_profile", "email"])
        .then((res: FacebookLoginResponse) =>
          this.fb
            .api(
              "me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)",
              []
            )
            .then((profile) => {
              console.log("profile", profile);
              if (this.errors.indexOf(profile) == -1) {
                let dict = {
                  name: profile["name"],
                  email: profile["email"],
                  password: "",
                  medium: "facebook",
                  social_id: profile["id"],
                  image: profile["picture_large"]["data"]["url"],
                  fcm_token: this.fcm_token,
                  contact: "",
                  location: "",
                  bio: "",
                };
                console.log("dict", dict);
                this.finalSignup(dict);
              } else {
                this.apiService.presentToast(
                  "Error,Please try after some time",
                  "danger"
                );
              }
            })
        )
        .catch((e) => {
          this.apiService.presentToast(
            "Error,Please try after some time",
            "danger"
          );
          console.log(e);
        });
    } else {
      this.fbLogin();
    }
  }

  fbLogin() {
    //this.loginType = 'Login with Facebook'
    // return this.fireAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());

    const provider = new firebase.auth.FacebookAuthProvider();
    this.fireAuth.auth
      .signInWithPopup(provider)
      .then((result) => {
        console.log("Signin result", result);
        // if(this.errors.indexOf(result) == -1){
        let dict = {
          name: result.additionalUserInfo.profile["name"],
          email: result.additionalUserInfo.profile["email"],
          password: "",
          medium: "facebook",
          social_id: result.additionalUserInfo.profile["id"],
          image: result.additionalUserInfo.profile["picture"]["data"]["url"],
          fcm_token: this.fcm_token,
          contact: "",
          location: "",
          bio: "",
        };
        console.log("dict", dict);
        this.finalSignup(dict);

        // }else{
        //     this.apiService.presentToast('Error,Please try after some time', 'danger')
        // }
      })
      .catch((error) => console.error("Sigin error", error));
  }

  //Google social login
  googleLogin() {
    console.log(this.googlePlus);
    if (this.platform.is("cordova")) {
      this.googlePlus
        .login({ scopes: "profile" })
        .then((profile) => {
          console.log(profile);
          if (this.errors.indexOf(profile) == -1) {
            let dict = {
              name: profile["displayName"],
              email: profile["email"],
              password: "",
              medium: "google",
              social_id: profile["userId"],
              image: !profile["imageUrl"] ? "" : profile["imageUrl"],
              fcm_token: this.fcm_token,
              contact: "",
              location: "",
              bio: "",
            };
            console.log("dict", dict);

            // var check_user = {
            //   medium: 'google',
            //   social_id: profile['id']
            // }
            // this.apiService.postData(check_user,'check_user_existance').subscribe((result) => {
            //   console.log(result);
            //   if(result.status == 0){

            //   }else{

            //   }
            // });

            this.finalSignup(dict);
          }
        })
        .catch((err) => {
          console.error(err);
          this.apiService.presentToast(
            "Error,Please try after some time",
            "danger"
          );
        });
    } else {
      this.gglLogin();
    }
  }

  gglLogin() {
    //this.loginType = 'Login with Facebook'
    // return this.fireAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());

    const provider = new firebase.auth.GoogleAuthProvider();
    this.fireAuth.auth
      .signInWithPopup(provider)
      .then((result) => {
        console.log("Signin result", result);
        // if(this.errors.indexOf(result) == -1){
        let dict = {
          name: result.additionalUserInfo.profile["name"],
          email: result.additionalUserInfo.profile["email"],
          password: "",
          medium: "google",
          social_id: result.additionalUserInfo.profile["id"],
          image: !result.additionalUserInfo.profile["picture"]
            ? ""
            : result.additionalUserInfo.profile["picture"],
          fcm_token: this.fcm_token,
          contact: "",
          location: "",
          bio: "",
        };
        console.log("dict", dict);
        this.finalSignup(dict);

        // }else{
        //     this.apiService.presentToast('Error,Please try after some time', 'danger')
        // }
      })
      .catch((error) => console.error("Sigin error", error));
  }

  finalSignup(dict) {
    this.apiService.presentLoading();
    // this.fcm.getToken().then(token => {
    this.apiService.postData(dict, "social_login").subscribe(
      (result) => {
        this.apiService.stopLoading();
        this.ref.detectChanges();
        if (result.status == 1) {
          localStorage.setItem("userId", result.data._id);
          localStorage.setItem("IsLoggedIn", "true");
          localStorage.setItem("profile", JSON.stringify(result.data));
          localStorage.setItem("user_name", result.data.name);
          localStorage.setItem("user_image", result.data.image);
          if (this.errors.indexOf(result.data.email) >= 0) {
            localStorage.setItem("user_email", "");
          } else {
            localStorage.setItem("user_email", result.data.email);
          }
          localStorage.setItem("user_medium", dict.medium);
          localStorage.setItem("first_login", result.data.first_login);
          this.globalFooService.publishSomeData({
            foo: { data: result.data, page: "profile" },
          });
          this.apiService.presentToast("Login successfully!", "success");
          //this.apiService.navCtrl.navigateRoot('tabs/home');

          if (result.data.first_login == true) {
            this.apiService.navCtrl.navigateRoot("tabs/home");
          } else {
            this.apiService.navCtrl.navigateRoot("/category");
          }
        } else {
          this.apiService.presentToast(
            "Error while signing up! Please try later",
            "danger"
          );
        }
      },
      (err) => {
        this.apiService.stopLoading();
        this.apiService.presentToast(
          "Technical error,Please try after some time",
          "danger"
        );
      }
    );
    // });
  }
}
