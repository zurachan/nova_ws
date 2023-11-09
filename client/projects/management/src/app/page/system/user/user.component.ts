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

  datasource = [];
  form: FormGroup
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

  ngOnInit() {
    this.initForm();
    this.getData();
  }

  initForm() {
    this.form = this.fb.group({
      user: [null],
      pageNumber: 1,
      pageSize: 5
    })
  }

  getData(isSearch?: boolean) {
    let param = _.cloneDeep(this.form.value);
    if (isSearch) param.pageNumber = 0

    this.userService.GetAll(param).subscribe((res: any) => {
      if (res.success) {
        this.paging = res.paging;

        this.paging.recordStart = this.paging.currentRecords < 1 ? 0 : (this.paging.pageNumber - 1) * this.paging.pageSize + 1
        this.paging.recordEnd = this.paging.currentRecords < 1 ? 0 : this.paging.recordStart + this.paging.currentRecords - 1

        let start = this.paging.recordStart;
        res.data.map((x: any) => {
          x.stt = start++;
          return x;
        });
        this.datasource = res.data
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

  pageChange(value) {
    if (value.number)
      this.form.controls.pageNumber.setValue(value.number)
    if (value.size)
      this.form.controls.pageSize.setValue(value.size)
    this.getData();
  }
}
