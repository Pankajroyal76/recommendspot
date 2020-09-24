import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddRecommendationPageRoutingModule } from './add-recommendation-routing.module';

import { AddRecommendationPage } from './add-recommendation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddRecommendationPageRoutingModule
  ],
  declarations: [AddRecommendationPage]
})
export class AddRecommendationPageModule {}
