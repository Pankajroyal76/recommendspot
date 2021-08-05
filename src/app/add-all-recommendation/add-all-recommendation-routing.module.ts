import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AddAllRecommendationComponent } from "./add-all-recommendation.component";

const routes: Routes = [{ path: "", component: AddAllRecommendationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAllRecommendationRoutingModule {}
