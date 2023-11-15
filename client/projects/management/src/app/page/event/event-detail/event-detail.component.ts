import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { EventStatus, EventType, ItemType } from '../../../shared/core/Enum';
import { ProjectService } from '../../../shared/services/project.service';
import { NotifierService } from 'angular-notifier';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventService } from '../../../shared/services/event.service';
import _ from "lodash";
import { format, isDate } from 'date-fns';
import { FileService } from '../../../shared/services/file.service';

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
      name: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      description: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      start: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      end: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      status: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      type: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      projectIds: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      coverImage: [{ value: null, disabled: this.modal.type == 'view' }],
    })
  }

  getDetail() {
    if (this.modal.type !== 'add') {
      this.eventService.GetById(this.modal.item.id).subscribe((detail: any) => {
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

    model.start = isDate(model.start) ? format(model.start, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : model.start;
    model.end = isDate(model.end) ? format(model.end, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : model.end;

    let request = this.modal.type == 'add' ? this.eventService.Insert(model) : this.eventService.Update(model);

    request.subscribe((res: any) => {
      if (res.success) {
        this.itemId = res.data.id;
        this.coverFormFile.append('ItemId', this.itemId.toString());
        this.coverFormFile.append('ItemType', ItemType.Event.toString());

        this.fileService.uploadFile(this.coverFormFile).subscribe((fileRes: any) => {
          if (!fileRes) {
            this.notifier.notify('error', "Upload ảnh cover sự kiện không thành công");
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
