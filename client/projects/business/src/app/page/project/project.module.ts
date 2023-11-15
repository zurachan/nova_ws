import { NgxSummernoteModule } from 'ngx-summernote';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectComponent } from './project.component';
import { ProjectGridComponent } from './project-grid/project-grid.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule, ProjectRoutingModule, ReactiveFormsModule, NgxSummernoteModule
  ],
  declarations: [ProjectComponent, ProjectGridComponent, ProjectDetailComponent]
})
export class ProjectModule { }
