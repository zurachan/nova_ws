import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxSummernoteModule } from 'ngx-summernote';
import { GridPaginationModule } from '../../layout/grid-pagination/grid-pagination.module';
import { PartnerDetailComponent } from './partner-detail/partner-detail.component';
import { PartnerGridComponent } from './partner-grid/partner-grid.component';
import { PartnerRoutingModule } from './partner-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    PartnerRoutingModule,
    GridPaginationModule,
    NgxSummernoteModule,
    ReactiveFormsModule,
  ],
  declarations: [
    PartnerGridComponent,
    PartnerDetailComponent
  ]
})
export class PartnerModule { }
