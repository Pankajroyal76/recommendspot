import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

import { AddlocalrecommendationPageRoutingModule } from './addlocalrecommendation-routing.module';

import { AddlocalrecommendationPage } from './addlocalrecommendation.page';

@NgModule({
  imports: [
    CommonModule,GooglePlaceModule,
    FormsModule,ReactiveFormsModule,
    IonicModule,
    AddlocalrecommendationPageRoutingModule
  ],
  declarations: [AddlocalrecommendationPage]
})
export class AddlocalrecommendationPageModule {}
