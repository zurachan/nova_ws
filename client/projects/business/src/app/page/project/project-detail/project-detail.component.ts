import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectPhase, ProjectType } from 'projects/management/src/app/shared/core/Enum';
import { User } from 'projects/management/src/app/shared/core/user';
import { PartnerService } from 'projects/management/src/app/shared/services/partner.service';
import { ProjectService } from 'projects/management/src/app/shared/services/project.service';
import { UserService } from 'projects/management/src/app/shared/services/user.service';
import _ from "lodash";


@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private fb: FormBuilder,
    private projectService: ProjectService,
    private spinnerService: NgxSpinnerService,
    private userService: UserService,
    private partnerService: PartnerService) { }

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
  user: User;
  form: FormGroup;

  ngOnInit() {
    this.getDetail();
    this.getPartner();
    this.initForm();
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
    this.form.markAllAsTouched();
    if (this.form.invalid) return
    debugger
    let formData = _.cloneDeep(this.form.getRawValue());
    console.log(formData)
  }

}
