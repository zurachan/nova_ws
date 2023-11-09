import { ContentType } from './../../../shared/core/Enum';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { ProjectService } from '../../../shared/services/project.service';
import _ from "lodash";
import { ContentService } from '../../../shared/services/content.service';

interface data {
  title: string,
  type: "add" | "edit" | 'view'
  item: any | null;
}

@Component({
  selector: 'app-content-detail',
  templateUrl: './content-detail.component.html',
  styleUrls: ['./content-detail.component.css']
})
export class ContentDetailComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: data,
    private dialogRef: MatDialogRef<ContentDetailComponent>,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private projectService: ProjectService,
    private contentService: ContentService) {
    this.modal = data;
  }
  subscriptions: Subscription[] = [];
  changeDetectorRef: ChangeDetectorRef;

  form: FormGroup;
  modal: any;
  contentType = ContentType;

  listProject = [];

  coverImage: any;
  coverImageUrl: any

  contentImage: any;
  contentImageUrl: any

  ngOnInit() {
    this.initForm();
    this.getDetail();
    this.getDropdownData()
  }

  initForm() {
    this.form = this.fb.group({
      id: [0],
      title: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      mainContent: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      type: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      projectIds: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
    })
  }

  getDetail() {
    if (this.modal.type !== 'add') {
      this.contentService.GetById(this.modal.item.id).subscribe((res: any) => {
        if (res.success) {
          this.form.patchValue(res.data)
        }
      });
    }
  }

  bindValueForm() {
    this.form.patchValue(this.modal.item);
  }

  getDropdownData() {
    const subscription = this.getProject().subscribe((project: any) => {
      this.listProject = project.data;
    });
    this.subscriptions.push(subscription);
  }

  getProject() {
    return this.projectService.GetPagingData({ pageNumber: 1, pageSize: 10000, project: null }).pipe();
  }

  onSave() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return

    let model = _.cloneDeep(this.form.getRawValue());

    let request = this.modal.type == 'add' ? this.contentService.Insert(model) : this.contentService.Update(model);

    request.subscribe((res: any) => {
      if (res.success) {
        this.dialogRef.close(true)
        let message = this.modal.type == 'add' ? "Thêm mới thành công" : "Cập nhật thành công";
        this.notifier.notify('success', message);
      } else {
        this.notifier.notify('error', res.message);
      }
    })
  }

  onUploadCoverImage(file: FileList) {
    this.coverImage = file.item(0);

    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.coverImageUrl = event.target.result;
    }
    reader.readAsDataURL(this.coverImage);
  }

  onUploadContentImage(file: FileList) {
    this.contentImage = file.item(0);

    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.contentImageUrl = event.target.result;
    }
    reader.readAsDataURL(this.contentImageUrl);
  }
}
