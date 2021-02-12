import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommentsPageRoutingModule } from './comments-routing.module';

import { CommentsPage } from './comments.page';
import { CommonPipeModule } from '../commonPipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,CommonPipeModule,
    IonicModule,
    CommentsPageRoutingModule
  ],
  declarations: [CommentsPage]
})
export class CommentsPageModule {}
