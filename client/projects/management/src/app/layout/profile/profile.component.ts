import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import _ from "lodash";
import { AuthenticateService } from '../../shared/services/authenticate.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private authenService: AuthenticateService,
    private fb: FormBuilder,
    private userService: UserService,
    private notifier: NotifierService) {
    this.credential = this.authenService.GetCredential;
  }
  credential: any;
  userProfile = {
    fileName: "",
    filePath: "",
  };

  ngOnInit() {
    this.initForm();
    this.bindValueForm();
    this.authenService.updateCredential.subscribe((res: any) => { this.credential = res; })
  }

  form: FormGroup;

  initForm() {
    this.form = this.fb.group({
      id: [null],
      fullName: [null, Validators.required],
      address: [null],
      email: [null, Validators.required],
      telephone: [null],
      username: [{ value: null, disabled: true }, Validators.required],
      biography: [null]
    })
  }

  bindValueForm() {
    this.form.patchValue(this.credential.user)
  }

  onSave() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return

    let user = _.cloneDeep(this.form.getRawValue());
    this.userService.Update(user).subscribe((res: any) => {
      if (res.success) {
        this.authenService.SetCredential(res.data)
        this.notifier.notify('success', "Cập nhật thành công");
      } else {
        this.notifier.notify('error', res.message);
      }
    })

  }
}
