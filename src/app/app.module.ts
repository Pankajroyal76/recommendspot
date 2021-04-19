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
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AuthGuard } from './services/auth.guard';
import { FCM } from '@ionic-native/fcm/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

//services
import { ApilinkService } from './services/apilink.service';
import { ApiserviceService } from './services/apiservice.service';

import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { environments } from './services/environment';
import { AngularFireAuthModule } from 'angularfire2/auth';


//pipe


import { Http, HttpModule, RequestOptions } from '@angular/http';
import { ServiceWorkerModule } from '@angular/service-worker';


//modules
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,NgxSpinnerModule, 
  IonicModule.forRoot(), 
  AppRoutingModule,
  HttpModule,
  AngularFireModule.initializeApp(environments.firebase),
  AngularFireAuthModule,
  ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production, scope: './', registrationStrategy: 'registerImmediately' })
  
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
    Crop,
    InAppBrowser,
    AuthGuard,
    FCM,
    PhotoViewer
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
