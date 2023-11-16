import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { format } from 'date-fns';
import _ from "lodash";
import { NgxSpinnerService } from 'ngx-spinner';
import { EventType } from 'projects/management/src/app/shared/core/Enum';
import { EventService } from 'projects/management/src/app/shared/services/event.service';
@Component({
  selector: 'app-event-grid',
  templateUrl: './event-grid.component.html',
  styleUrls: ['./event-grid.component.css']
})
export class EventGridComponent implements OnInit {

  constructor(private eventService: EventService, private fb: FormBuilder, private spinnerService: NgxSpinnerService) { }

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
    this.eventService.GetPagingData(param).subscribe((res: any) => {
      if (res.success) {
        this.paging = res.paging;
        res.data.map(x => {
          x.pathImage = "data:image/png;base64," + x.pathImage;
          x.createdDate = x.createdDate ? format(new Date(Date.parse(x.createdDate)), 'dd/MM/yyyy HH:mm') : x.createdDate;
          return x;
        })
        this.datasource = res.data
        console.log(this.datasource)
        this.spinnerService.hide()
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

  getEventTypeStr(typeId) {
    let type = EventType.find(x => x.id == typeId);
    return type ? type.name : null;
  }

}
