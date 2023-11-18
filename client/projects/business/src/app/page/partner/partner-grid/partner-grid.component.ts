import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import _ from "lodash";
import { NgxSpinnerService } from 'ngx-spinner';
import { PartnerService } from 'projects/management/src/app/shared/services/partner.service';

@Component({
  selector: 'app-partner-grid',
  templateUrl: './partner-grid.component.html',
  styleUrls: ['./partner-grid.component.css']
})
export class PartnerGridComponent implements OnInit {

  constructor(private fb: FormBuilder, private projectService: PartnerService, private spinnerService: NgxSpinnerService) { }
  form: FormGroup
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
    this.initForm()
    this.getData();

  }
  initForm() {
    this.form = this.fb.group({
      partner: [null],
      pageNumber: 1,
      pageSize: 6
    })
  }

  getData(isSearch?: boolean) {
    let param = _.cloneDeep(this.form.value);
    if (isSearch) param.pageNumber = 0
    this.spinnerService.show()
    this.projectService.GetPagingData(param).subscribe((res: any) => {
      if (res.success) {
        this.paging = res.paging;
        res.data.map(x => {
          x.pathImage = "data:image/png;base64," + x.pathImage;
          return x;
        })
        this.datasource = res.data
      }
      this.spinnerService.hide()
    });
  }

  onBlurSearch() {
    this.getData();
  }

  pageChange(value) {
    if (value.number)
      this.form.controls.pageNumber.setValue(value.number)
    if (value.size)
      this.form.controls.pageSize.setValue(value.size)
    this.getData();
  }
}
