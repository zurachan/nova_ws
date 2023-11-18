import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { format, isDate } from 'date-fns';
import _ from "lodash";
import { NgxSpinnerService } from 'ngx-spinner';
import { EventStatus, EventType, ItemType } from '../../../shared/core/Enum';
import { EventService } from '../../../shared/services/event.service';
import { FileService } from '../../../shared/services/file.service';
import { ProjectService } from '../../../shared/services/project.service';
import { CommonService } from '../../../shared/services/common.service';

interface data {
  title: string,
  type: "add" | "edit" | 'view'
  item: any | null;
}

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: data,
    private dialogRef: MatDialogRef<EventDetailComponent>,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private projectService: ProjectService,
    private eventService: EventService,
    private spinnerService: NgxSpinnerService, private commonService: CommonService,
    private fileService: FileService) {
    this.modal = data;
  }

  form: FormGroup;
  modal: any;
  eventType = EventType;
  eventStatus = EventStatus;

  listProject = [];

  coverImageUrl: any
  coverFormFile = new FormData();

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
      name: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      description: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      start: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      end: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      status: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      type: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      projectIds: [{ value: null, disabled: this.modal.type == 'view' }],
      coverImage: [{ value: null, disabled: this.modal.type == 'view' }],
      pathImage: [null],
    })
  }

  getDetail() {
    if (this.modal.type !== 'add') {
      this.spinnerService.show();
      this.eventService.GetById(this.modal.item.id).subscribe((detail: any) => {
        if (detail.success) {
          this.form.patchValue(detail.data)
          if (detail.data.pathImage) {
            this.coverImageUrl = "data:image/png;base64," + detail.data.pathImage;
            let file = this.commonService.dataURItoBlob(this.coverImageUrl)
            this.coverFormFile.append('FormFile', file);
          }
        }
        this.spinnerService.hide();
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

    this.fileService.uploadFile(this.coverFormFile).subscribe((fileRes: any) => {
      if (fileRes.success) {
        let model = _.cloneDeep(this.form.getRawValue());
        model.pathImage = fileRes.data
        model.start = isDate(model.start) ? format(model.start, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : model.start;
        model.end = isDate(model.end) ? format(model.end, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : model.end;
        let request = this.modal.type == 'add' ? this.eventService.Insert(model) : this.eventService.Update(model);

        request.subscribe((res: any) => {
          if (res.success) {
            this.dialogRef.close(true)
            let message = this.modal.type == 'add' ? "Thêm mới thành công" : "Cập nhật thành công";
            this.notifier.notify('success', message);
          } else {
            this.notifier.notify('error', res.message);
          }
        })
      } else {
        this.notifier.notify('error', "Upload ảnh cover sự kiện không thành công");
      }
    })
  }

  onUploadCoverImage(fileList: FileList) {
    let reader = new FileReader();
    this.coverFormFile = new FormData();
    this.coverFormFile.append('FormFile', fileList[0]);
    reader.onload = (event: any) => {
      this.coverImageUrl = event.target.result;
    }
    reader.readAsDataURL(fileList[0]);
  }
}
