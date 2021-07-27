import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SavedPostsPageRoutingModule } from './saved-posts-routing.module';

import { SavedPostsPage } from './saved-posts.page';
import { CommonPipeModule } from '../commonPipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,CommonPipeModule,
    IonicModule,ReactiveFormsModule,
    SavedPostsPageRoutingModule
  ],
  declarations: [SavedPostsPage]
})
export class SavedPostsPageModule {}
