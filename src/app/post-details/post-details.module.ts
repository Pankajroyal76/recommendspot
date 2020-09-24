import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostDetailsPageRoutingModule } from './post-details-routing.module';

import { PostDetailsPage } from './post-details.page';
import { CommonPipeModule } from '../services/commonPipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonPipeModule,
    PostDetailsPageRoutingModule
  ],
  declarations: [PostDetailsPage]
})
export class PostDetailsPageModule {}
