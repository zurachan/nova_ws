import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import _ from "lodash";
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectPhase, ProjectType } from 'projects/management/src/app/shared/core/Enum';
import { User } from 'projects/management/src/app/shared/core/user';
import { CustomerService } from 'projects/management/src/app/shared/services/customer.service';
import { PartnerService } from 'projects/management/src/app/shared/services/partner.service';
import { ProjectService } from 'projects/management/src/app/shared/services/project.service';
import { UserService } from 'projects/management/src/app/shared/services/user.service';


@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private spinnerService: NgxSpinnerService,
    private userService: UserService,
    private partnerService: PartnerService,
    private customerService: CustomerService,
    private notifier: NotifierService) { }

  project = {
    id: null,
    name: null,
    content: null,
    type: null,
    phase: null,
    pathImage: null,
    partnerIds: null,
    userId: null
  };

  partners = [];
  user = new User();
  form: FormGroup;
  emailPattern = /^\w+([-+.']\w+)*@gmail.com*$/;

  ngOnInit() {
    this.getDetail();
    this.getPartner();
    this.initForm();
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

  getDetail() {
    this.spinnerService.show();
    this.projectService.GetById(this.activatedRoute.snapshot.params['id']).subscribe((res: any) => {
      if (res.success) {
        res.data.pathImage = "data:image/png;base64," + res.data.pathImage;
        this.project = res.data;

        this.getUserById(this.project.userId).subscribe((userRes: any) => {
          if (userRes.success) {
            this.user = userRes.data;
          }
        })

        this.form.controls.projectId.setValue(this.project.id)
        this.spinnerService.hide()
      }
    })
  }

  getProjectTypeStr(typeId) {
    let type = ProjectType.find(x => x.id == typeId);
    return type ? type.name : null
  }

  getProjectPhaseStr(phaseId) {
    let phase = ProjectPhase.find(x => x.id == phaseId);
    return phase ? phase.name : null
  }

  getPartner() {
    this.partnerService.GetPagingData({ partner: "", pageNumber: 1, pageSize: 10000 }).subscribe((res: any) => {
      if (res.success) {
        this.partners = res.data;
      }
    })
  }

  getUserById(userId) {
    return this.userService.GetById(userId).pipe();
  }

  getPartnerName(partnerIds: any) {
    return partnerIds ? this.partners.filter(x => partnerIds.includes(x.id)).map(x => x.name).toString().replaceAll(',', '; ') : [];
  }

  onSubmit() {
    debugger

    this.form.markAllAsTouched();
    if (this.form.invalid) return

    debugger

    // return
    // let formData = _.cloneDeep(this.form.getRawValue());
    // this.spinnerService.show()
    // this.customerService.Insert(formData).subscribe((res: any) => {
    //   if (res.success) {
    //     this.notifier.notify('success', "Đăng ký nhận thông tin thành công");
    //     this.form.reset()
    //   }
    //   this.spinnerService.hide();
    // })
  }
}
