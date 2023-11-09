import { Component, OnInit } from '@angular/core';
import { DeleteConfirmComponent } from '../../shared/component/delete-confirm/delete-confirm.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import _ from "lodash";
import { EventService } from '../../shared/services/event.service';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup } from '@angular/forms';
import { format } from 'date-fns';
@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  constructor(private eventService: EventService, private dialog: MatDialog, private notifier: NotifierService, private fb: FormBuilder) { }

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
      event: [null],
      pageNumber: 1,
      pageSize: 5
    })
  }

  getData(isSearch?: boolean) {
    let param = _.cloneDeep(this.form.value);
    if (isSearch) param.pageNumber = 0

    this.eventService.GetPagingData(param).subscribe((res: any) => {
      if (res.success) {
        this.paging = res.paging;

        this.paging.recordStart = this.paging.currentRecords < 1 ? 0 : (this.paging.pageNumber - 1) * this.paging.pageSize + 1
        this.paging.recordEnd = this.paging.currentRecords < 1 ? 0 : this.paging.recordStart + this.paging.currentRecords - 1

        let start = this.paging.recordStart;
        res.data.map((x: any) => {
          x.stt = start++;
          x.start = x.start ? format(new Date(Date.parse(x.start)), 'dd/MM/yyyy') : x.start;
          x.end = x.end ? format(new Date(Date.parse(x.end)), 'dd/MM/yyyy') : x.end;
          return x;
        });
        this.datasource = res.data
      }
    });
  }

  onAddViewEdit(type: 'add' | 'edit' | 'view', item: any = null) {
    const dialogRef = this.dialog.open(EventDetailComponent, {
      data: {
        title: type == 'edit' ? 'Cập nhật sự kiện' : type == 'add' ? 'Thêm mới sự kiện' : 'Chi tiết sự kiện',
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
        title: 'Sự kiện',
        item: item.name,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.eventService.Delete(item.id).subscribe(res => {
          if (res.success) {
            this.getData()
            this.notifier.notify('success', "Xoá sự kiện " + item.name + " thành công");
          } else {
            this.notifier.notify('error', "Xoá sự kiện " + item.name + " không thành công");
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
