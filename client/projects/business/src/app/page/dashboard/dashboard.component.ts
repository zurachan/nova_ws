import { Component, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContentType, ProjectType, ProjectTypeEnum } from 'projects/management/src/app/shared/core/Enum';
import { ContentService } from 'projects/management/src/app/shared/services/content.service';
import { EventService } from 'projects/management/src/app/shared/services/event.service';
import { PartnerService } from 'projects/management/src/app/shared/services/partner.service';
import { ProjectService } from 'projects/management/src/app/shared/services/project.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private projectService: ProjectService,
    private contentService: ContentService,
    private eventService: EventService,
    private spinnerService: NgxSpinnerService,
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
  content = {
    id: null,
    title: null,
    mainContent: null,
    type: null,
    pathImage: null,
    createdDate: null,
    createdById: null,
  }

  partners = [];

  ngOnInit() {
    this.spinnerService.show();
    forkJoin([
      this.projectService.GetPagingData({ project: "", type: ProjectTypeEnum.None, phase: 0, pageNumber: 1, pageSize: 1 }),
      this.contentService.GetPagingData({ content: "", pageNumber: 1, pageSize: 1 }),
      this.partnerService.GetPagingData({ partner: "", pageNumber: 1, pageSize: 3 })
    ]).subscribe(([projectRes, contentRes, partnerRes]: any) => {
      if (projectRes.success && projectRes.data.length > 0) {
        this.project = projectRes.data[0]
        this.project.pathImage = "data:image/png;base64," + this.project.pathImage;
      }
      if (contentRes.success && contentRes.data.length > 0) {
        this.content = contentRes.data[0]
        this.content.pathImage = "data:image/png;base64," + this.content.pathImage;
        this.content.createdDate = this.content.createdDate ? format(new Date(Date.parse(this.content.createdDate)), 'dd/MM/yyyy HH:mm') : this.content.createdDate;
      }
      if (partnerRes.success) {
        partnerRes.data.map((x: any) => {
          x.pathImage = "data:image/png;base64," + x.pathImage;
          return x;
        });
        this.partners = partnerRes.data
      }
      this.spinnerService.hide()
    })
  }

  getProjectType(typeId) {
    let type = ProjectType.find(x => x.id == typeId);
    return type ? type.name : null;
  }

  getContentTypeStr(typeId) {
    let type = ContentType.find(x => x.id == typeId);
    return type ? type.name : null;
  }
}
