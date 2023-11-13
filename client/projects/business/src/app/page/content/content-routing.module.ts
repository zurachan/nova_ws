import { NgModule } from '@angular/core';
import { ContentGridComponent } from './content-grid/content-grid.component';
import { ContentDetailComponent } from './content-detail/content-detail.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ContentGridComponent },
  { path: ':id', component: ContentDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentRoutingModule { }
