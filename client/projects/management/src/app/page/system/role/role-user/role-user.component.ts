import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { RoleService } from 'projects/management/src/app/shared/services/role.service';
import _ from "lodash";

@Component({
  selector: 'app-role-user',
  templateUrl: './role-user.component.html',
  styleUrls: ['./role-user.component.css']
})
export class RoleUserComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<RoleUserComponent>,
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
