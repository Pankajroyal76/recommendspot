import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';
import { YouTubePlayerModule } from "@angular/youtube-player";
import { HomePage } from './home.page';
import { CommonPipeModule } from '../commonPipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,YouTubePlayerModule,
    IonicModule,
    CommonPipeModule,
    HomePageRoutingModule, 
    ReactiveFormsModule
  ],
  declarations: [HomePage],
  exports: [CommonPipeModule]
})
export class HomePageModule {}
