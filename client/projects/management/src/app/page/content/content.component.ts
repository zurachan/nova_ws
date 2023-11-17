import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import _ from "lodash";
import { NgxSpinnerService } from 'ngx-spinner';
import { DeleteConfirmComponent } from '../../shared/component/delete-confirm/delete-confirm.component';
import { ContentType } from '../../shared/core/Enum';
import { ContentService } from '../../shared/services/content.service';
import { ContentDetailComponent } from './content-detail/content-detail.component';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor(private contentService: ContentService, private dialog: MatDialog, private notifier: NotifierService, private fb: FormBuilder, private spinnerService: NgxSpinnerService) { }

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
      content: [null],
      pageNumber: 1,
      pageSize: 5
    })
  }

  getData(isSearch?: boolean) {
    let param = _.cloneDeep(this.form.value);
    if (isSearch) param.pageNumber = 0
    this.spinnerService.show()
    this.contentService.GetPagingData(param).subscribe((res: any) => {
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
    const dialogRef = this.dialog.open(ContentDetailComponent, {
      data: {
        title: type == 'edit' ? 'Cập nhật bài viết' : type == 'add' ? 'Thêm mới bài viết' : 'Chi tiết bài viết',
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
        title: 'Bài viết',
        item: item.title,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.contentService.Delete(item.id).subscribe(res => {
          if (res.success) {
            this.getData()
            this.notifier.notify('success', "Xoá bài viết " + item.title + " thành công");
          } else {
            this.notifier.notify('error', "Xoá bài viết " + item.title + " không thành công");
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

  getTypeStr(typeId: number) {
    let type = ContentType.find(x => x.id == typeId);
    return type ? type.name : null;
  }

}
