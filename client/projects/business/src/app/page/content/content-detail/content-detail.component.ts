import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContentType } from 'projects/management/src/app/shared/core/Enum';
import { User } from 'projects/management/src/app/shared/core/user';
import { ContentService } from 'projects/management/src/app/shared/services/content.service';
import { UserService } from 'projects/management/src/app/shared/services/user.service';

@Component({
  selector: 'app-content-detail',
  templateUrl: './content-detail.component.html',
  styleUrls: ['./content-detail.component.css']
})
export class ContentDetailComponent implements OnInit {

  constructor(private spinnerService: NgxSpinnerService,
    private contentService: ContentService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService) { }

  content = {
    id: null,
    title: null,
    mainContent: null,
    type: null,
    pathImage: null,
    createdDate: null,
    createdById: null,
  }

  user = new User();

  ngOnInit() {
    this.getDetail();
  }

  getDetail() {
    this.spinnerService.show();
    this.contentService.GetById(this.activatedRoute.snapshot.params['id']).subscribe((res: any) => {
      if (res.success) {
        res.data.pathImage = "data:image/png;base64," + res.data.pathImage;
        this.content = res.data;
        this.content.createdDate = this.content.createdDate ? format(new Date(Date.parse(this.content.createdDate)), 'dd/MM/yyyy HH:mm') : this.content.createdDate;
        this.getUserById(this.content.createdById).subscribe((userRes: any) => {
          if (userRes.success) {
            this.user = userRes.data;
          }
        })
        this.spinnerService.hide()
      }
    })
  }

  getContentTypeStr(typeId) {
    let type = ContentType.find(x => x.id == typeId);
    return type ? type.name : null;
  }

  getUserById(userId) {
    return this.userService.GetById(userId);
  }
}
