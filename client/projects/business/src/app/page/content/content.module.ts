import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentGridComponent } from './content-grid/content-grid.component';
import { ContentDetailComponent } from './content-detail/content-detail.component';
import { ContentRoutingModule } from './content-routing.module';
import { GridPaginationModule } from '../../layout/grid-pagination/grid-pagination.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ContentRoutingModule,
    GridPaginationModule,
    NgxSummernoteModule,
    ReactiveFormsModule,
  ],
  declarations: [ContentGridComponent, ContentDetailComponent]
})
export class ContentModule { }
