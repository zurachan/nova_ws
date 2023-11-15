import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSummernoteModule } from 'ngx-summernote';
import { GridPaginationModule } from '../../layout/grid-pagination/grid-pagination.module';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectGridComponent } from './project-grid/project-grid.component';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project.component';

@NgModule({
  imports: [
    CommonModule,
    ProjectRoutingModule,
    ReactiveFormsModule,
    NgxSummernoteModule,
    GridPaginationModule,
    NgxSpinnerModule
  ],
  declarations: [
    ProjectComponent,
    ProjectGridComponent,
    ProjectDetailComponent
  ]
})
export class ProjectModule { }
