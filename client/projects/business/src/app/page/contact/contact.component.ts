import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import _ from "lodash";
import { CustomerService } from 'projects/management/src/app/shared/services/customer.service';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private customerService: CustomerService, private fb: FormBuilder, private notifier: NotifierService) { }
  form: FormGroup;


  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.form = this.fb.group({
      fullName: [null, Validators.required],
      email: [null, Validators.required],
      telephone: [null, Validators.required],
      address: [null],
      projectId: [null]
    })
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return
    let formData = _.cloneDeep(this.form.getRawValue());
    this.customerService.Insert(formData).subscribe((res: any) => {
      if (res.success) {
        this.notifier.notify('success', "Đăng ký nhận thông tin thành công");
        this.form.reset()
      }
    })
  }
}
