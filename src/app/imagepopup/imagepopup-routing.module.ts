import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImagepopupPage } from './imagepopup.page';

const routes: Routes = [
  {
    path: '',
    component: ImagepopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImagepopupPageRoutingModule {}
