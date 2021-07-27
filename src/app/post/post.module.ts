import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { NgxSocialShareModule } from 'ngx-social-share';
import { IonicModule } from '@ionic/angular';

import { PostPageRoutingModule } from './post-routing.module';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { PostPage } from './post.page';
import { CommonPipeModule } from '../commonPipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonPipeModule,GooglePlaceModule,
    PostPageRoutingModule,
    ReactiveFormsModule,
   // NgxSocialShareModule
  ],
  declarations: [PostPage],
  exports: [CommonPipeModule]
})
export class PostPageModule {}
