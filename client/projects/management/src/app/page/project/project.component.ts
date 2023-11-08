import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DeleteConfirmComponent } from '../../shared/component/delete-confirm/delete-confirm.component';
import _ from "lodash";
import { ProjectService } from '../../shared/services/project.service';
import { ProjectPhase, ProjectType } from '../../shared/core/Enum';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  constructor(private projectService: ProjectService, private dialog: MatDialog, private notifier: NotifierService, private fb: FormBuilder) { }

  projectData = [];
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
      project: [null],
      pageNumber: 1,
      pageSize: 5
    })
  }

  getData(isSearch?: boolean) {
    let param = _.cloneDeep(this.form.value);
    if (isSearch) param.pageNumber = 0

    this.projectService.GetAll(param).subscribe((res: any) => {
      if (res.success) {
        this.paging = res.paging;

        this.paging.recordStart = this.paging.currentRecords < 1 ? 0 : (this.paging.pageNumber - 1) * this.paging.pageSize + 1
        this.paging.recordEnd = this.paging.currentRecords < 1 ? 0 : this.paging.recordStart + this.paging.currentRecords - 1

        let start = this.paging.recordStart;
        res.data.map((x: any) => {
          x.stt = start++;
          return x;
        });
        this.projectData = res.data
        console.log(this.projectData)
      }
    });
  }

  onAddViewEdit(type: 'add' | 'edit' | 'view', item: any = null) {
    const dialogRef = this.dialog.open(ProjectDetailComponent, {
      data: {
        title: type == 'edit' ? 'Cập nhật dự án' : type == 'add' ? 'Thêm mới dự án' : 'Chi tiết dự án',
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
        title: 'Dự án',
        item: item.name,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.projectService.Delete(item.id).subscribe(res => {
          if (res.success) {
            this.getData()
            this.notifier.notify('success', "Xoá dự án " + item.name + " thành công");
          } else {
            this.notifier.notify('error', "Xoá dự án " + item.name + " không thành công");
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

  getProjectTypeStr(typeId) {
    let type = ProjectType.find(x => x.id == typeId);
    return type ? type.name : null;
  }

  getProjectPhaseStr(phaseId) {
    let phase = ProjectPhase.find(x => x.id == phaseId);
    return phase ? phase.name : null;
  }
}
