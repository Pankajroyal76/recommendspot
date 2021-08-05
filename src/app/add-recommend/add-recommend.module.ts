import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AddRecommendPageRoutingModule } from "./add-recommend-routing.module";

import { AddRecommendPage } from "./add-recommend.page";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

@NgModule({
  imports: [
    CommonModule,
    GooglePlaceModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddRecommendPageRoutingModule,
  ],
  declarations: [AddRecommendPage],
})
export class AddRecommendPageModule {}
