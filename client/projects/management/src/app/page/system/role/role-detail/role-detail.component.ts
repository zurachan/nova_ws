import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import _ from "lodash";
import { NotifierService } from 'angular-notifier';
import { RoleService } from 'projects/management/src/app/shared/services/role.service';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.css']
})
export class RoleDetailComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<RoleDetailComponent>,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private roleService: RoleService) {
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
      id: [null],
      name: [null, Validators.required]
    })
  }

  bindValueForm() {
    this.form.patchValue(this.modal.item);
  }

  onSave() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return

    let role = _.cloneDeep(this.form.value);
    this.roleService.Update(role).subscribe((res: any) => {
      if (res.success) {
        this.dialogRef.close(true)
        this.notifier.notify('success', "Cập nhật thành công");
      } else {
        this.notifier.notify('error', res.message);
      }
    })
  }
}
