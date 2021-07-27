import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddRecommendPageRoutingModule } from './add-recommend-routing.module';

import { AddRecommendPage } from './add-recommend.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddRecommendPageRoutingModule
  ],
  declarations: [AddRecommendPage]
})
export class AddRecommendPageModule {}
