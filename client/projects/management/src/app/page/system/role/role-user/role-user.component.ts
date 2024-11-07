import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import _ from "lodash";
import { UserRoleService } from 'projects/management/src/app/shared/services/user-role.service';
import { UserService } from 'projects/management/src/app/shared/services/user.service';
import { Subscription, forkJoin } from 'rxjs';

interface data {
  title: string,
  item: any | null;
}

@Component({
  selector: 'app-role-user',
  templateUrl: './role-user.component.html',
  styleUrls: ['./role-user.component.css']
})
export class RoleUserComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: data,
    private dialogRef: MatDialogRef<RoleUserComponent>,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private userService: UserService, private userRoleService: UserRoleService) {
    this.modal = data;
  }
  subscriptions: Subscription[] = [];

  form: FormGroup;
  modal: any;

  listUser = [];

  ngOnInit() {
    this.initForm();
    this.getDropdownData()
  }

  initForm() {
    this.form = this.fb.group({
      roleId: [null],
      userId: [null],
    })
  }

  getDropdownData() {
    const subscription = forkJoin([this.getUser(), this.getUserRole()]).subscribe(([user, userRole]: any) => {
      this.listUser = user.data;
      this.form.controls.userId.setValue(userRole.data)
      this.form.controls.roleId.setValue(this.modal.item.id)
    });
    this.subscriptions.push(subscription);
  }

  getUser() {
    return this.userService.GetPagingData({ pageNumber: 1, pageSize: 10000, user: null });
  }

  getUserRole() {
    return this.userRoleService.getUsersByRole(this.modal.item.id);
  }

  onSave() {
    let model = _.cloneDeep(this.form.getRawValue());
    this.userRoleService.SaveUserRoles(model)
      .subscribe((res: any) => {
        if (res.success) {
          this.dialogRef.close(true)
          this.notifier.notify('success', "Phân quyền " + this.modal.item.name + " thành công");
        } else {
          this.notifier.notify('error', res.message);
        }
      })
  }

}
