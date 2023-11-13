import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { AboutComponent } from './page/about/about.component';
import { ContactComponent } from './page/contact/contact.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  {
    path: 'event',
    loadChildren: () => import('./page/event/event.module').then((m) => m.EventModule)
  },
  {
    path: 'content',
    loadChildren: () => import('./page/content/content.module').then((m) => m.ContentModule)
  },
  {
    path: 'project',
    loadChildren: () => import('./page/project/project.module').then((m) => m.ProjectModule)
  },
  { path: '**', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
