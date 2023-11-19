import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import _ from "lodash";
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerService } from 'projects/management/src/app/shared/services/customer.service';
import { AppSettingsService } from './../../../../../management/src/app/shared/services/app-settings.service';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private customerService: CustomerService,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private spinner: NgxSpinnerService,
    private appSettingsService: AppSettingsService) { }
  form: FormGroup;
  emailPattern = /^\w+([-+.']\w+)*@gmail.com*$/;
  Info = {
    companyName: null,
    companyDescription: null,
    email: null,
    phone: null,
    address: null,
    facebook: null,
    map: null
  }

  ngOnInit() {
    this.initForm()
    this.getCommonInfo();
  }

  initForm() {
    this.form = this.fb.group({
      fullName: [null, Validators.required],
      email: [null, [Validators.required, Validators.pattern(this.emailPattern)]],
      telephone: [null, Validators.required],
      address: [null],
      projectId: [null]
    })
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return
    let formData = _.cloneDeep(this.form.getRawValue());
    this.spinner.show();
    this.customerService.Insert(formData).subscribe((res: any) => {
      if (res.success) {
        this.notifier.notify('success', "Đăng ký nhận thông tin thành công");
        this.form.reset()
      }
      this.spinner.hide();
    })
  }

  getCommonInfo() {
    let url = '/assets/config/common-info.json';
    this.spinner.show();
    this.appSettingsService.getJSON(url).subscribe((res) => {
      this.Info = res
      this.spinner.hide();
    });
  }
}
