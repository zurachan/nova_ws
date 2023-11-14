import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectComponent } from './project.component';
import { ProjectUrbanComponent } from './project-urban/project-urban.component';
import { ProjectTourismComponent } from './project-tourism/project-tourism.component';
import { ProjectIndustrialComponent } from './project-industrial/project-industrial.component';
import { ProjectGridComponent } from './project-grid/project-grid.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule, ProjectRoutingModule, ReactiveFormsModule
  ],
  declarations: [ProjectComponent, ProjectUrbanComponent, ProjectTourismComponent, ProjectIndustrialComponent, ProjectGridComponent, ProjectDetailComponent]
})
export class ProjectModule { }
