import { Component, OnInit } from '@angular/core';
import { RoleDetailComponent } from './role-detail/role-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { RoleService } from '../../../shared/services/role.service';
import { DeleteConfirmComponent } from '../../../shared/component/delete-confirm/delete-confirm.component';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup } from '@angular/forms';
import _ from "lodash";
import { UserService } from '../../../shared/services/user.service';
import { UserRoleService } from '../../../shared/services/user-role.service';
import { Subscription, forkJoin } from 'rxjs';
import { RoleUserComponent } from './role-user/role-user.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  constructor(private userService: UserService, private roleService: RoleService, private userRoleService: UserRoleService, private fb: FormBuilder, private dialog: MatDialog, private notifier: NotifierService) { }
  subscriptions: Subscription[] = [];
  form: FormGroup;
  datasource = [];
  paging = {
    pageNumber: null,
    pageSize: null,
    firstPage: null,
    lastPage: null,
    totalPages: null,
    totalRecords: null,
    nextPage: null,
    previousPage: null,
    currentRecords: null,
    recordStart: null,
    recordEnd: null,
  };

  users = [];
  userRoles = [];


  ngOnInit() {
    this.initForm();
    this.getData();
  }

  initForm() {
    this.form = this.fb.group({
      role: [null],
      pageNumber: 1,
      pageSize: 5
    })
  }

  getData(isSearch?: boolean) {
    let param = _.cloneDeep(this.form.value);
    if (isSearch) param.pageNumber = 0

    const subscription = forkJoin([this.getUser(), this.getRole(param), this.getUserRole()])
      .subscribe(([userRes, roleRes, userRoleRes]: any) => {
        this.users = userRes.data;
        this.userRoles = userRoleRes.data;

        this.paging = roleRes.paging;
        this.paging.recordStart = this.paging.currentRecords < 1 ? 0 : (this.paging.pageNumber - 1) * this.paging.pageSize + 1
        this.paging.recordEnd = this.paging.currentRecords < 1 ? 0 : this.paging.recordStart + this.paging.currentRecords - 1
        let start = this.paging.recordStart;

        this.datasource = roleRes.data.map((role: any) => {
          role.stt = start++;
          let userRoles = this.userRoles.filter(ur => ur.roleId == role.id).map(ur => ur.userId);
          let usersHasRole = this.users.filter(ur => userRoles.includes(ur.id))
          role.listUser = [];
          usersHasRole.forEach(x => { role.listUser.push(x) })
          role.listUser = role.listUser.map(x => x.fullName).toString().replaceAll(',', '; ');
          return role;
        });
      });
    this.subscriptions.push(subscription);
  }

  getUser() {
    return this.userService.GetPagingData({ pageNumber: 1, pageSize: 10000, user: null });
  }

  getRole(param: any) {
    return this.roleService.GetPagingData(param);
  }

  getUserRole() {
    return this.userRoleService.GetAllUserRoles();
  }

  onEditRole(item: any) {
    const dialogRef = this.dialog.open(RoleDetailComponent, {
      data: {
        title: 'Cập nhật quyền',
        item
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.getData()
      }
    });
  }

  onDeleteRole(item: any) {
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      data: {
        title: 'Quyền',
        item: item.name,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.roleService.Delete(item.id).subscribe(res => {
          if (res.success) {
            this.getData()
            this.notifier.notify('success', "Xoá quyền " + item.name + " thành công");
          } else {
            this.notifier.notify('error', "Xoá quyền " + item.name + " không thành công");
          }
        })
      }
    });
  }
  pageChange(value) {
    if (value.number)
      this.form.controls.pageNumber.setValue(value.number)
    if (value.size)
      this.form.controls.pageSize.setValue(value.size)
    this.getData();
  }

  onAddUserRole(role) {
    const userRoldDialog = this.dialog.open(RoleUserComponent, {
      data: {
        title: 'Danh sách nhân sự quyền ' + role.name,
        item: role,
      }
    });

    userRoldDialog.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.getData()
      }
    });
  }
}
