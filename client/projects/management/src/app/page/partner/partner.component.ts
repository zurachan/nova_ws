import { Component, OnInit } from '@angular/core';
import { DeleteConfirmComponent } from '../../shared/component/delete-confirm/delete-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PartnerService } from '../../shared/services/partner.service';
import { PartnerDetailComponent } from './partner-detail/partner-detail.component';
import _ from "lodash";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.css']
})
export class PartnerComponent implements OnInit {

  constructor(private partnerService: PartnerService,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private fb: FormBuilder,
    private spinnerService: NgxSpinnerService) { }

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
      partner: [null],
      pageNumber: 1,
      pageSize: 5
    })
  }

  getData(isSearch?: boolean) {
    let param = _.cloneDeep(this.form.value);
    if (isSearch) param.pageNumber = 0
    this.spinnerService.show();
    this.partnerService.GetPagingData(param).subscribe((res: any) => {
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
      this.spinnerService.hide();
    });
  }

  onAddViewEdit(type: 'add' | 'edit' | 'view', item: any = null) {
    const dialogRef = this.dialog.open(PartnerDetailComponent, {
      data: {
        title: type == 'edit' ? 'Cập nhật đối tác' : type == 'add' ? 'Thêm mới đối tác' : 'Chi tiết đối tác',
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
        title: 'Đối tác',
        item: item.name,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.partnerService.Delete(item.id).subscribe(res => {
          if (res.success) {
            this.getData()
            this.notifier.notify('success', "Xoá đối tác " + item.name + " thành công");
          } else {
            this.notifier.notify('error', "Xoá đối tác " + item.name + " không thành công");
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
