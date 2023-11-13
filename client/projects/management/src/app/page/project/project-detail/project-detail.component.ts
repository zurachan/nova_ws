import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { ItemType, ProjectPhase, ProjectType } from '../../../shared/core/Enum';
import { ProjectService } from '../../../shared/services/project.service';
import _ from "lodash";
import { PartnerService } from '../../../shared/services/partner.service';
import { UserService } from '../../../shared/services/user.service';
import { Subscription, forkJoin } from 'rxjs';
import { FileService } from '../../../shared/services/file.service';

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
    private userService: UserService,
    private fileService: FileService) {
    this.modal = data;
  }

  form: FormGroup;
  modal: any;
  projectType = ProjectType;
  projectPhase = ProjectPhase;
  listPartner = [];
  listUser = [];
  editorDisabled = false

  coverImageUrl: any
  coverFormFile = new FormData();

  contentImageUrl = [];
  contentFormFile = new FormData();

  itemId = 0;
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
      coverImage: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      contentImage: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required]
    })
  }

  getDetail() {
    if (this.modal.type !== 'add') {
      forkJoin([
        this.projectService.GetById(this.modal.item.id),
        this.fileService.getImage({ itemId: this.modal.item.id, itemType: ItemType.ProjectCover }),
        this.fileService.getImage({ itemId: this.modal.item.id, itemType: ItemType.ProjectContent })
      ]).subscribe(([detail, cover, content]: any) => {
        if (detail.success) { this.form.patchValue(detail.data) }
        if (cover.success && cover.data.length > 0) {
          this.form.controls.coverImage.clearValidators();
          this.form.controls.coverImage.updateValueAndValidity();

          this.coverImageUrl = "upload/" + cover.data[0].filePath;
          this.coverFormFile.append('Id', cover.data[0].id);
        }
        if (content.success && content.data.length > 0) {
          this.form.controls.contentImage.clearValidators();
          this.form.controls.contentImage.updateValueAndValidity();

          content.data.forEach(img => {
            this.contentImageUrl.push("upload/" + img.filePath);
          });
        }
      });
    }
  }

  bindValueForm() {
    this.form.patchValue(this.modal.item);
  }

  getDropdownData() {
    forkJoin([this.getUser(), this.getPartner()]).subscribe(([user, partner]: any) => {
      this.listUser = user.data;
      this.listPartner = partner.data;
    });
  }

  getUser() {
    return this.userService.GetPagingData({ pageNumber: 1, pageSize: 10000, user: null }).pipe();
  }

  getPartner() {
    return this.partnerService.GetPagingData({ pageNumber: 1, pageSize: 10000, partner: null }).pipe();
  }

  onSave() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return
    let model = _.cloneDeep(this.form.getRawValue());

    let request = this.modal.type == 'add' ? this.projectService.Insert(model) : this.projectService.Update(model);

    request.subscribe((res: any) => {
      if (res.success) {
        this.itemId = res.data.id;
        this.coverFormFile.append('ItemId', this.itemId.toString());
        this.coverFormFile.append('ItemType', ItemType.ProjectCover.toString());

        this.contentFormFile.append('ItemId', this.itemId.toString());
        this.contentFormFile.append('ItemType', ItemType.ProjectContent.toString());

        forkJoin([this.fileService.uploadFile(this.coverFormFile), this.fileService.uploadMultiFile(this.contentFormFile)])
          .subscribe(([singleRes, multiRes]: any) => {
            if (!singleRes) {
              this.notifier.notify('error', "Upload ảnh cover dự án không thành công");
            } else if (!multiRes) {
              this.notifier.notify('error', "Upload ảnh mô tả dự án không thành công");
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