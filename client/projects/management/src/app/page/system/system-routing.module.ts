import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';
import { PermissionComponent } from './permission/permission.component';

const routes: Routes = [
  { path: 'role', component: RoleComponent },
  { path: 'user', component: UserComponent },
  { path: 'permission', component: PermissionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class SystemRoutingModule { }
