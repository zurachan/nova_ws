import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenRequest } from '../../model/login.model';
import { AuthenticateService } from './../../shared/services/authenticate.service';
import { Component, OnInit } from '@angular/core';
import _ from "lodash";
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model = new AuthenRequest();

  /**
   *
   */
  constructor(private authenticateService: AuthenticateService, private fb: FormBuilder, private notifier: NotifierService,) { }

  form: FormGroup;

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.form = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    })
  }

  async OnClickLogin() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return

    let model = _.cloneDeep(this.form.value);

    const loginResult = await this.authenticateService.Login(model);

    if (!loginResult.isOk) {
      this.notifier.notify('error', loginResult.message);
    }
  }
}
