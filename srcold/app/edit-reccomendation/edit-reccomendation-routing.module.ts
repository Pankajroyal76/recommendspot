import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditReccomendationPage } from './edit-reccomendation.page';

const routes: Routes = [
  {
    path: '',
    component: EditReccomendationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditReccomendationPageRoutingModule {}
