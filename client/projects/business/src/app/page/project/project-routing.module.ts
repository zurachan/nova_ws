import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectGridComponent } from './project-grid/project-grid.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectComponent } from './project.component';

const routes: Routes = [
  { path: '', component: ProjectComponent },
  { path: 'urban', component: ProjectGridComponent },
  { path: 'tourism', component: ProjectGridComponent },
  { path: 'industrial', component: ProjectGridComponent },
  { path: ':id', component: ProjectDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule { }
