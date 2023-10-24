import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemRoutingModule } from './system-routing.module';
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';
import { PermissionComponent } from './permission/permission.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RoleDetailComponent } from './role/role-detail/role-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DeleteConfirmComponent } from '../../shared/component/delete-confirm/delete-confirm.component';
@NgModule({
  declarations: [
    RoleComponent,
    RoleDetailComponent,
    UserComponent,
    PermissionComponent,
    DeleteConfirmComponent
  ],
  imports: [
    CommonModule, SystemRoutingModule, MatDialogModule, ReactiveFormsModule
  ],
})
export class SystemModule { }
