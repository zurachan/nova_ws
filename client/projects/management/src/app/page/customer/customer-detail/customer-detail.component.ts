import { Component, OnInit, Inject } from '@angular/core';
import { CustomerService } from '../../../shared/services/customer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import _ from "lodash";

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<CustomerDetailComponent>,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private customerService: CustomerService) {
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
      fullName: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      telephone: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      email: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
      address: [{ value: null, disabled: this.modal.type == 'view' }, Validators.required],
    })
  }

  bindValueForm() {
    this.form.patchValue(this.modal.item);
  }

  onSave() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return

    let model = _.cloneDeep(this.form.getRawValue());

    let request = this.modal.type == 'add' ? this.customerService.Insert(model) : this.customerService.Update(model);

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
