import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventGridComponent } from './event-grid/event-grid.component';
import { EventDetailComponent } from './event-detail/event-detail.component';


const routes: Routes = [
  { path: '', component: EventGridComponent },
  { path: ':id', component: EventDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventRoutingModule { }
