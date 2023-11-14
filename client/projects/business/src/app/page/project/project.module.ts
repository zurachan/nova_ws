import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectGridComponent } from './project-grid/project-grid.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectComponent } from './project.component';

@NgModule({
  imports: [
    CommonModule, ProjectRoutingModule
  ],
  declarations: [ProjectComponent, ProjectGridComponent, ProjectDetailComponent]
})
export class ProjectModule { }
