import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TimeAgoPipe} from 'time-ago-pipe';
import { FilterPipe } from './filter.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [TimeAgoPipe, FilterPipe],
  exports: [TimeAgoPipe, FilterPipe ]
})
export class CommonPipeModule { }