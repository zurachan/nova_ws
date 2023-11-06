import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { DeleteConfirmComponent } from '../../../shared/component/delete-confirm/delete-confirm.component';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup } from '@angular/forms';
import _ from "lodash";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private userService: UserService, private dialog: MatDialog, private notifier: NotifierService, private fb: FormBuilder) { }

  userData = [];
  form: FormGroup

  ngOnInit() {
    this.initForm();
    this.getData();
  }

  initForm() {
    this.form = this.fb.group({
      user: [null]
    })
  }

  getData(isSearch?: boolean) {
    let param = _.cloneDeep(this.form.value);
    this.userService.GetAll(param).subscribe((res: any) => {
      if (res.success) {
        res.data.map((x: any) => {
          x.stt = res.data.indexOf(x) + 1;
          return x;
        });
        this.userData = res.data
      }
    });
  }

  onAddEdit(type: 'add' | 'edit', item: any = null) {
    const dialogRef = this.dialog.open(UserDetailComponent, {
      data: {
        title: type == 'edit' ? 'Cập nhật nhân viên' : 'Thêm mới nhân viên',
        type,
        item
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.getData()
      }
    });
  }

  onDelete(item: any) {
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      data: {
        title: 'Nhân viên',
        item: item.fullName,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userService.Delete(item.id).subscribe(res => {
          if (res.success) {
            this.getData()
            this.notifier.notify('success', "Xoá nhân viên " + item.fullName + " thành công");
          } else {
            this.notifier.notify('error', "Xoá nhân viên " + item.fullName + " không thành công");
          }
        })
      }
    });
  }
}
