import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartnerDetailComponent } from './partner-detail/partner-detail.component';
import { PartnerGridComponent } from './partner-grid/partner-grid.component';


const routes: Routes = [
  { path: '', component: PartnerGridComponent },
  { path: ':id', component: PartnerDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartnerRoutingModule { }
