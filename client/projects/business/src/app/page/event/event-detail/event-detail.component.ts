import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { NgxSpinnerService } from 'ngx-spinner';
import { EventStatus, EventType } from 'projects/management/src/app/shared/core/Enum';
import { User } from 'projects/management/src/app/shared/core/user';
import { EventService } from 'projects/management/src/app/shared/services/event.service';
import { UserService } from 'projects/management/src/app/shared/services/user.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  constructor(private spinnerService: NgxSpinnerService,
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService) { }

  event = {
    id: null,
    name: null,
    description: null,
    start: null,
    end: null,
    status: null,
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
    this.eventService.GetById(this.activatedRoute.snapshot.params['id']).subscribe((res: any) => {
      if (res.success) {
        res.data.pathImage = "data:image/png;base64," + res.data.pathImage;
        this.event = res.data;
        this.event.start = this.event.start ? format(new Date(Date.parse(this.event.start)), 'dd/MM/yyyy') : this.event.start;
        this.event.end = this.event.end ? format(new Date(Date.parse(this.event.end)), 'dd/MM/yyyy') : this.event.end;
        this.getUserById(this.event.createdById).subscribe((userRes: any) => {
          if (userRes.success) {
            this.user = userRes.data;
          }
        })
        this.spinnerService.hide()
      }
    })
  }

  getEventTypeStr(typeId) {
    let type = EventType.find(x => x.id == typeId);
    return type ? type.name : null;
  }

  getEventStatusStr(statusId) {
    let status = EventStatus.find(x => x.id == statusId);
    return status ? status.name : null;
  }

  getUserById(userId) {
    return this.userService.GetById(userId).pipe();
  }
}
