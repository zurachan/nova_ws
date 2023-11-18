import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { format } from 'date-fns';
import _ from "lodash";
import { NgxSpinnerService } from 'ngx-spinner';
import { ContentType } from 'projects/management/src/app/shared/core/Enum';
import { ContentService } from 'projects/management/src/app/shared/services/content.service';

@Component({
  selector: 'app-content-grid',
  templateUrl: './content-grid.component.html',
  styleUrls: ['./content-grid.component.css']
})
export class ContentGridComponent implements OnInit {
  constructor(private contentService: ContentService, private fb: FormBuilder, private spinnerService: NgxSpinnerService) { }

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
  datasource = [];
  form: FormGroup

  contentType = ContentType;


  ngOnInit() {
    this.initForm();
    this.getData();
  }

  initForm() {
    this.form = this.fb.group({
      content: [null],
      pageNumber: 1,
      pageSize: 6
    })
  }

  getData(isSearch?: boolean) {
    let param = _.cloneDeep(this.form.value);
    if (isSearch) param.pageNumber = 0
    this.spinnerService.show()
    this.contentService.GetPagingData(param).subscribe((res: any) => {
      if (res.success) {
        this.paging = res.paging;
        res.data.map(x => {
          x.pathImage = "data:image/png;base64," + x.pathImage;
          x.createdDate = x.createdDate ? format(new Date(Date.parse(x.createdDate)), 'dd/MM/yyyy HH:mm') : x.createdDate;
          return x;
        })
        this.datasource = res.data
      }
      this.spinnerService.hide()
    });
  }

  pageChange(value) {
    if (value.number)
      this.form.controls.pageNumber.setValue(value.number)
    if (value.size)
      this.form.controls.pageSize.setValue(value.size)
    this.getData();
  }

  getContentTypeStr(typeId) {
    let type = ContentType.find(x => x.id == typeId);
    return type ? type.name : null;
  }

  onBlurSearch() {
    this.getData();
  }

  onChangePhase() {
    this.getData();
  }
}
