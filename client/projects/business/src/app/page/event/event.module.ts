import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxSummernoteModule } from 'ngx-summernote';
import { GridPaginationModule } from '../../layout/grid-pagination/grid-pagination.module';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { EventGridComponent } from './event-grid/event-grid.component';
import { EventRoutingModule } from './event-routing.module';

@NgModule({
  imports: [
    CommonModule,
    EventRoutingModule,
    GridPaginationModule,
    NgxSummernoteModule
  ],
  declarations: [
    EventGridComponent,
    EventDetailComponent
  ]
})
export class EventModule { }
