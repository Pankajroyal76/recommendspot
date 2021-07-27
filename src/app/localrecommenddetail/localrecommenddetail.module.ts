import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocalrecommenddetailPageRoutingModule } from './localrecommenddetail-routing.module';

import { LocalrecommenddetailPage } from './localrecommenddetail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocalrecommenddetailPageRoutingModule
  ],
  declarations: [LocalrecommenddetailPage]
})
export class LocalrecommenddetailPageModule {}
