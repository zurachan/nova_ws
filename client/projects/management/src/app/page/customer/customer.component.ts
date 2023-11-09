import { Component, OnInit } from '@angular/core';
import { DeleteConfirmComponent } from '../../shared/component/delete-confirm/delete-confirm.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import _ from "lodash";
import { CustomerService } from '../../shared/services/customer.service';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  constructor(private customerService: CustomerService, private dialog: MatDialog, private notifier: NotifierService, private fb: FormBuilder) { }

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
      customer: [null],
      pageNumber: 1,
      pageSize: 5
    })
  }

  getData(isSearch?: boolean) {
    let param = _.cloneDeep(this.form.value);
    if (isSearch) param.pageNumber = 0

    this.customerService.GetAll(param).subscribe((res: any) => {
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

  onAddEditView(type: 'add' | 'edit' | 'view', item: any = null) {
    const dialogRef = this.dialog.open(CustomerDetailComponent, {
      data: {
        title: type == 'edit' ? 'Cập nhật khách hàng' : type == 'add' ? 'Thêm mới khách hàng' : 'Chi tiết khách hàng',
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
        title: 'Khách hàng',
        item: item.fullName,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.customerService.Delete(item.id).subscribe(res => {
          if (res.success) {
            this.getData()
            this.notifier.notify('success', "Xoá khách hàng " + item.fullName + " thành công");
          } else {
            this.notifier.notify('error', "Xoá khách hàng " + item.fullName + " không thành công");
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
