import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../shared/services/authenticate.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import _ from "lodash";
import { UserService } from '../../shared/services/user.service';
import { NotifierService } from 'angular-notifier';
import { FileService } from '../../shared/services/file.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private authenService: AuthenticateService,
    private fb: FormBuilder,
    private userService: UserService,
    private notifier: NotifierService,
    private fileService: FileService) {
    this.credential = this.authenService.GetCredential;
    console.log(this.credential)
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
    // this.getUserProfileImage();
  }

  form: FormGroup;

  initForm() {
    this.form = this.fb.group({
      id: [null],
      fullName: [null, Validators.required],
      address: [null],
      email: [null, Validators.required],
      telephone: [null],
      username: [{ value: null, disabled: true }, Validators.required]
    })
  }

  bindValueForm() {
    this.form.patchValue(this.credential.user)
  }

  // getUserProfileImage() {
  //   this.fileService.getImage({ itemId: this.credential.user.id, itemType: 1 }).subscribe((res: any) => {
  //     this.userProfile = res.data[0];
  //   })
  // }

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
