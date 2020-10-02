import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImagepopupPageRoutingModule } from './imagepopup-routing.module';

import { ImagepopupPage } from './imagepopup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImagepopupPageRoutingModule
  ],
  declarations: [ImagepopupPage]
})
export class ImagepopupPageModule {}
