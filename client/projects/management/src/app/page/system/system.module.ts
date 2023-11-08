import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemRoutingModule } from './system-routing.module';
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';
import { PermissionComponent } from './permission/permission.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RoleDetailComponent } from './role/role-detail/role-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { MatTableModule } from '@angular/material/table';
import { PaginationModule } from '../../shared/component/pagination/pagination.module';
import { DeleteConfirmModule } from '../../shared/component/delete-confirm/delete-confirm.module';
@NgModule({
  declarations: [
    RoleComponent,
    RoleDetailComponent,
    UserComponent,
    UserDetailComponent,
    PermissionComponent
  ],
  imports: [
    CommonModule,
    SystemRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatTableModule,
    PaginationModule,
    DeleteConfirmModule
  ],
})
export class SystemModule { }
