import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AddAllRecommendationRoutingModule } from "./add-all-recommendation-routing.module";
import { AddAllRecommendationComponent } from "./add-all-recommendation.component";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [AddAllRecommendationComponent],
  imports: [
    CommonModule,
    GooglePlaceModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddAllRecommendationRoutingModule,
  ],
})
export class AddAllRecommendationModule {}
