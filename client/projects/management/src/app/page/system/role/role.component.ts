import { Component, OnInit } from '@angular/core';
import { RoleDetailComponent } from './role-detail/role-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { RoleService } from '../../../shared/services/role.service';
import { DeleteConfirmComponent } from '../../../shared/component/delete-confirm/delete-confirm.component';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup } from '@angular/forms';
import _ from "lodash";

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  constructor(private roleService: RoleService, private fb: FormBuilder, private dialog: MatDialog, private notifier: NotifierService) { }

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
    this.roleService.GetAll(param).subscribe((res: any) => {
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
}
