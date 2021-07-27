import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocalrecommenddetailPage } from './localrecommenddetail.page';

const routes: Routes = [
  {
    path: '',
    component: LocalrecommenddetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalrecommenddetailPageRoutingModule {}
