import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectGridComponent } from './project-grid/project-grid.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';

@NgModule({
  imports: [
    CommonModule, ProjectRoutingModule
  ],
  declarations: [ProjectGridComponent, ProjectDetailComponent]
})
export class ProjectModule { }
