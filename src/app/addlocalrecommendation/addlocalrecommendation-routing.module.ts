import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddlocalrecommendationPage } from './addlocalrecommendation.page';

const routes: Routes = [
  {
    path: '',
    component: AddlocalrecommendationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddlocalrecommendationPageRoutingModule {}
