import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventGridComponent } from './event-grid/event-grid.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { EventRoutingModule } from './event-routing.module';

@NgModule({
  imports: [
    CommonModule,
    EventRoutingModule
  ],
  declarations: [
    EventGridComponent,
    EventDetailComponent
  ]
})
export class EventModule { }
