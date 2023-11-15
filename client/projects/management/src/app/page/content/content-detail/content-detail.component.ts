import { ContentType, ItemType } from './../../../shared/core/Enum';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { ProjectService } from '../../../shared/services/project.service';
import _ from "lodash";
import { ContentService } from '../../../shared/services/content.service';
import { FileService } from '../../../shared/services/file.service';

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
    private contentService: ContentService,
    private fileService: FileService) {
    this.modal = data;
  }

  form: FormGroup;
  modal: any;
  contentType = ContentType;

  listProject = [];

  coverImageUrl: any
  coverFormFile = new FormData();

  contentImageUrl = [];
  contentFormFile = new FormData();

  //Summernote
  config: any = {
    airMode: false,
    tabDisable: true,
    height: '200px',
    uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['undo', 'redo']],
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'clear'
        ]
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['view', ['codeview']]
    ],
  };
  //

  itemId = 0;

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
      coverImage: [{ value: null, disabled: this.modal.type == 'view' }],
    })
  }

  getDetail() {
    if (this.modal.type !== 'add') {
      this.contentService.GetById(this.modal.item.id).subscribe((detail: any) => {
        if (detail.success) {
          this.form.patchValue(detail.data)
          this.coverImageUrl = "upload/" + detail.data.pathImage;
        }
      })
    }
  }

  getDropdownData() {
    this.getProject().subscribe((project: any) => {
      this.listProject = project.data;
    });
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
        this.itemId = res.data.id;
        this.coverFormFile.append('ItemId', this.itemId.toString());
        this.coverFormFile.append('ItemType', ItemType.Content.toString());

        this.fileService.uploadFile(this.coverFormFile).subscribe((fileRes: any) => {
          if (!fileRes) {
            this.notifier.notify('error', "Upload ảnh cover bài viết không thành công");
          } else {
            this.dialogRef.close(true)
            let message = this.modal.type == 'add' ? "Thêm mới thành công" : "Cập nhật thành công";
            this.notifier.notify('success', message);
          }
        })
      } else {
        this.notifier.notify('error', res.message);
      }
    })
  }

  onUploadCoverImage(fileList: FileList) {
    let reader = new FileReader();
    this.coverFormFile.append('FileDetails', fileList[0]);
    reader.onload = (event: any) => {
      this.coverImageUrl = event.target.result;
    }
    reader.readAsDataURL(fileList[0]);
  }

  onUploadContentImage(fileList: FileList) {
    this.contentImageUrl = [];
    Array.from(fileList).forEach(file => {
      this.contentFormFile.append('FileDetails', file)

      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.contentImageUrl.push(event.target.result);
      }
      reader.readAsDataURL(file)
    });
  }
}
