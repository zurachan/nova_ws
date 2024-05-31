import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import _ from 'lodash';
import { UserService } from 'projects/management/src/app/shared/services/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<UserDetailComponent>,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private userService: UserService
  ) {
    this.modal = data;
  }

  form: FormGroup;
  modal: any;

  ngOnInit() {
    this.initForm();
    this.bindValueForm();
  }

  initForm() {
    this.form = this.fb.group({
      id: [0],
      fullName: [null, Validators.required],
      username: [
        { value: null, disabled: this.modal.type === 'edit' },
        Validators.required,
      ],
      telephone: [null, Validators.required],
      email: [null, Validators.required],
      address: [null, Validators.required],
    });
  }

  bindValueForm() {
    this.form.patchValue(this.modal.item);
  }

  onSave() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    let role = _.cloneDeep(this.form.getRawValue());

    let request =
      this.modal.type == 'add'
        ? this.userService.Insert(role)
        : this.userService.Update(role);

    request.subscribe((res: any) => {
      if (res.success) {
        this.dialogRef.close(true);
        let message =
          this.modal.type == 'add'
            ? 'Thêm mới thành công'
            : 'Cập nhật thành công';
        this.notifier.notify('success', message);
      } else {
        this.notifier.notify('error', res.message);
      }
    });
  }
}
