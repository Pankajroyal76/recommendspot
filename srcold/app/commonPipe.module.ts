import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DateAgoPipe} from './date-ago.pipe';
import { FilterPipe } from './filter.pipe';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DateAgoPipe, FilterPipe],
  exports: [DateAgoPipe, FilterPipe ]
})
export class CommonPipeModule { }