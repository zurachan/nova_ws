import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './page/customer/customer.component';
import { PartnerComponent } from './page/partner/partner.component';
import { ProjectComponent } from './page/project/project.component';
import { ContentComponent } from './page/content/content.component';
import { EventComponent } from './page/event/event.component';
import { LoginComponent } from './layout/login/login.component';
import { ProfileComponent } from './layout/profile/profile.component';
import { AuthenticateGuard } from './shared/services/authenticate.service';
import { ErrorComponent } from './layout/error/error.component';
import { HomeComponent } from './layout/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthenticateGuard] },
  { path: 'content', component: ContentComponent, canActivate: [AuthenticateGuard] },
  { path: 'customer', component: CustomerComponent, canActivate: [AuthenticateGuard] },
  { path: 'event', component: EventComponent, canActivate: [AuthenticateGuard] },
  { path: 'partner', component: PartnerComponent, canActivate: [AuthenticateGuard] },
  { path: 'project', component: ProjectComponent, canActivate: [AuthenticateGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AuthenticateGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthenticateGuard] },
  {
    path: 'system',
    loadChildren: () => import('../app/page/system/system.module').then((m) => m.SystemModule),
    canActivate: [AuthenticateGuard]
  },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
