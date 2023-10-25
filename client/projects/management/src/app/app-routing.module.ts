import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './page/customer/customer.component';
import { PartnerComponent } from './page/partner/partner.component';
import { ProjectComponent } from './page/project/project.component';
import { ContentComponent } from './page/content/content.component';
import { EventComponent } from './page/event/event.component';
import { LoginComponent } from './layout/login/login.component';
import { ProfileComponent } from './layout/profile/profile.component';

const routes: Routes = [
  { path: 'content', component: ContentComponent },
  { path: 'customer', component: CustomerComponent },
  { path: 'event', component: EventComponent },
  { path: 'partner', component: PartnerComponent },
  { path: 'project', component: ProjectComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  {
    path: 'system',
    loadChildren: () => import('../app/page/system/system.module').then((m) => m.SystemModule),
    // canActivate: [AuthenticateGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
