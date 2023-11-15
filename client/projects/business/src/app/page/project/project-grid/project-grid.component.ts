import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectPhase, ProjectTypeEnum } from 'projects/management/src/app/shared/core/Enum';
import { ProjectService } from 'projects/management/src/app/shared/services/project.service';
import _ from "lodash";

@Component({
  selector: 'app-project-grid',
  templateUrl: './project-grid.component.html',
  styleUrls: ['./project-grid.component.css']
})
export class ProjectGridComponent implements OnInit {

  constructor(private router: Router, private fb: FormBuilder, private projectService: ProjectService) { }

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

    this.projectService.GetPagingData(param).subscribe((res: any) => {
      if (res.success) {
        this.paging = res.paging;

        this.paging.recordStart = this.paging.currentRecords < 1 ? 0 : (this.paging.pageNumber - 1) * this.paging.pageSize + 1
        this.paging.recordEnd = this.paging.currentRecords < 1 ? 0 : this.paging.recordStart + this.paging.currentRecords - 1

        let start = this.paging.recordStart;
        res.data.map((x: any) => {
          x.stt = start++;
          x.pathImage = "upload/" + x.pathImage;
          return x;
        });
        this.datasource = res.data
      }
    });
  }
}
