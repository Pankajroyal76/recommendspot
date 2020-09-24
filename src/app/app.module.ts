import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//providers
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Crop } from '@ionic-native/crop/ngx';

//services
import { ApilinkService } from './services/apilink.service';
import { ApiserviceService } from './services/apiservice.service';

import { Http, HttpModule, RequestOptions } from '@angular/http';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
  IonicModule.forRoot(), 
  AppRoutingModule,
  HttpModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: RequestOptions, useClass: ApilinkService },
    ApiserviceService,
    Camera,
    File,
    FilePath,
    FileTransfer,
    SocialSharing,
    Facebook,
    GooglePlus, 
    Crop
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
