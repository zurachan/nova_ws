import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { PartnerService } from '../../../shared/services/partner.service';
import _ from "lodash";
import { CommonService } from '../../../shared/services/common.service';
import { FileService } from '../../../shared/services/file.service';
import { NgxSpinnerService } from 'ngx-spinner';
interface data {
  title: string,
  type: "add" | "edit" | 'view'
  item: any | null;
}
@Component({
  selector: 'app-partner-detail',
  templateUrl: './partner-detail.component.html',
  styleUrls: ['./partner-detail.component.css']
})
export class PartnerDetailComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: data,
    private dialogRef: MatDialogRef<PartnerDetailComponent>,
    private fb: FormBuilder, private spinnerService: NgxSpinnerService,
    private notifier: NotifierService, private commonService: CommonService,
    private partnerService: PartnerService, private fileService: FileService) {
    this.modal = data;
  }

  form: FormGroup;
  modal: any
  coverImageUrl: any
  coverFormFile = new FormData();

  ngOnInit() {
    this.initForm();
    this.getDetail();
  }

  initForm() {
    this.form = this.fb.group({
      id: [0],
      name: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      telephone: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      email: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      address: [{ value: null, disabled: this.modal.type == 'view' }],
      coverImage: [{ value: null, disabled: this.modal.type == 'view' }],
      pathImage: [null],
    })
  }

  getDetail() {
    if (this.modal.type !== 'add') {
      this.spinnerService.show();
      this.partnerService.GetById(this.modal.item.id).subscribe((detail: any) => {
        if (detail.success) {
          this.form.patchValue(detail.data)
          if (detail.data.pathImage) {
            this.coverImageUrl = "data:image/png;base64," + detail.data.pathImage;
            let file = this.commonService.dataURItoBlob(this.coverImageUrl)
            this.coverFormFile.append('FormFile', file);
          }
          this.spinnerService.hide();
        }
      })
    }
  }

  onSave() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return

    this.fileService.uploadFile(this.coverFormFile).subscribe((fileRes: any) => {
      if (fileRes.success) {
        let model = _.cloneDeep(this.form.getRawValue());
        model.pathImage = fileRes.data
        let request = this.modal.type == 'add' ? this.partnerService.Insert(model) : this.partnerService.Update(model);

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
    this.coverFormFile.append('FormFile', fileList[0]);
    reader.onload = (event: any) => {
      this.coverImageUrl = event.target.result;
    }
    reader.readAsDataURL(fileList[0]);
  }
}
