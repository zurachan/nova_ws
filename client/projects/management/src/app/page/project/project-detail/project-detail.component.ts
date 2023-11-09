import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { ProjectPhase, ProjectType } from '../../../shared/core/Enum';
import { ProjectService } from '../../../shared/services/project.service';
import _ from "lodash";
import { PartnerService } from '../../../shared/services/partner.service';
import { UserService } from '../../../shared/services/user.service';
import { Subscription, forkJoin } from 'rxjs';

interface data {
  title: string,
  type: "add" | "edit" | 'view'
  item: any | null;
}

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: data,
    private dialogRef: MatDialogRef<ProjectDetailComponent>,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private projectService: ProjectService,
    private partnerService: PartnerService,
    private userService: UserService) {
    this.modal = data;
  }
  subscriptions: Subscription[] = [];

  form: FormGroup;
  modal: any;
  projectType = ProjectType;
  projectPhase = ProjectPhase;
  listPartner = [];
  listUser = [];

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
      content: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      type: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      phase: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      partnerIds: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      userId: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
    })
  }

  getDetail() {
    if (this.modal.type !== 'add') {
      this.projectService.GetById(this.modal.item.id).subscribe((res: any) => {
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
    const subscription = forkJoin([this.getUser(), this.getPartner()])
      .subscribe(([user, partner]: any) => {
        this.listUser = user.data;
        this.listPartner = partner.data;
      });
    this.subscriptions.push(subscription);
  }

  getUser() {
    return this.userService.GetAll({ pageNumber: 1, pageSize: 10000, user: null }).pipe();
  }

  getPartner() {
    return this.partnerService.GetAll({ pageNumber: 1, pageSize: 10000, partner: null }).pipe();
  }

  onSave() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return

    let model = _.cloneDeep(this.form.getRawValue());

    let request = this.modal.type == 'add' ? this.projectService.Insert(model) : this.projectService.Update(model);

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
