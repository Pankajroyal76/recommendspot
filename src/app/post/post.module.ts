import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { NgxSocialShareModule } from 'ngx-social-share';
import { IonicModule } from '@ionic/angular';

import { PostPageRoutingModule } from './post-routing.module';

import { PostPage } from './post.page';
import { CommonPipeModule } from '../services/commonPipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonPipeModule,
    PostPageRoutingModule,
    ReactiveFormsModule,
   // NgxSocialShareModule
  ],
  declarations: [PostPage]
})
export class PostPageModule {}
