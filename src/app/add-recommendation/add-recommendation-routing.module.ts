import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddRecommendationPage } from './add-recommendation.page';

const routes: Routes = [
  {
    path: '',
    component: AddRecommendationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddRecommendationPageRoutingModule {}
