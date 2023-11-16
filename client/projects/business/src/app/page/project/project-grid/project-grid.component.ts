import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import _ from "lodash";
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectPhase, ProjectTypeEnum } from 'projects/management/src/app/shared/core/Enum';
import { ProjectService } from 'projects/management/src/app/shared/services/project.service';

@Component({
  selector: 'app-project-grid',
  templateUrl: './project-grid.component.html',
  styleUrls: ['./project-grid.component.css']
})
export class ProjectGridComponent implements OnInit {

  constructor(private router: Router, private fb: FormBuilder, private projectService: ProjectService, private spinnerService: NgxSpinnerService) { }

  page = {
    title: ''
  }

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

  form: FormGroup
  projectPhase = ProjectPhase;
  datasource = [];
  ngOnInit() {
    this.initForm();
    let url = this.router.url.split('/').pop();
    switch (url) {
      case 'urban':
        this.page.title = "Bất động sản đô thị"
        this.form.controls.type.setValue(ProjectTypeEnum.Urban);
        break;
      case 'tourism':
        this.page.title = "Bất động sản du lịch"
        this.form.controls.type.setValue(ProjectTypeEnum.Tourism);
        break;
      case 'industrial':
        this.page.title = "Bất động sản công nghiệp"
        this.form.controls.type.setValue(ProjectTypeEnum.Industrial);
        break;
    }
    this.getData();
  }

  initForm() {
    this.form = this.fb.group({
      project: [null],
      type: [ProjectTypeEnum.None],
      phase: [0],
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

  onBlurSearch() {
    this.getData();
  }

  onChangePhase() {
    this.getData();
  }


}
