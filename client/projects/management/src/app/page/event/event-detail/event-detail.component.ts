import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EventStatus, EventType } from '../../../shared/core/Enum';
import { ProjectService } from '../../../shared/services/project.service';
import { NotifierService } from 'angular-notifier';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventService } from '../../../shared/services/event.service';
import _ from "lodash";
import { format, isDate } from 'date-fns';

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
    private eventService: EventService) {
    this.modal = data;
  }
  subscriptions: Subscription[] = [];
  changeDetectorRef: ChangeDetectorRef;

  form: FormGroup;
  modal: any;
  eventType = EventType;
  eventStatus = EventStatus;

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
      name: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      description: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      start: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      end: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      status: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      type: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      projectIds: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
    })
  }

  getDetail() {
    if (this.modal.type !== 'add') {
      this.eventService.GetById(this.modal.item.id).subscribe((res: any) => {
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
  onKey(value) { }
}
