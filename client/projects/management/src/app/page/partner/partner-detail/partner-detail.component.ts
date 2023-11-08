import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { PartnerService } from '../../../shared/services/partner.service';
import _ from "lodash";

@Component({
  selector: 'app-partner-detail',
  templateUrl: './partner-detail.component.html',
  styleUrls: ['./partner-detail.component.css']
})
export class PartnerDetailComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<PartnerDetailComponent>,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private partnerService: PartnerService) {
    this.modal = data;
  }

  form: FormGroup;
  modal: any

  ngOnInit() {
    this.initForm();
    this.bindValueForm()
  }

  initForm() {
    this.form = this.fb.group({
      id: [0],
      name: [null, Validators.required],
      telephone: [null, Validators.required],
      email: [null, Validators.required],
      address: [null],
    })
  }

  bindValueForm() {
    this.form.patchValue(this.modal.item);
  }

  onSave() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return

    let role = _.cloneDeep(this.form.getRawValue());

    let request = this.modal.type == 'add' ? this.partnerService.Insert(role) : this.partnerService.Update(role);

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

}
