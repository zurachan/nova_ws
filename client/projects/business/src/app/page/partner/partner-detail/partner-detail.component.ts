import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PartnerService } from 'projects/management/src/app/shared/services/partner.service';

@Component({
  selector: 'app-partner-detail',
  templateUrl: './partner-detail.component.html',
  styleUrls: ['./partner-detail.component.css']
})
export class PartnerDetailComponent implements OnInit {

  constructor(private spinnerService: NgxSpinnerService,
    private eventService: PartnerService,
    private activatedRoute: ActivatedRoute) { }

  partner = {
    name: null,
    telephone: null,
    email: null,
    address: null,
    pathImage: null
  };

  ngOnInit() {
    this.getDetail();
  }

  getDetail() {
    this.spinnerService.show();
    this.eventService.GetById(this.activatedRoute.snapshot.params['id']).subscribe((res: any) => {
      if (res.success) {
        res.data.pathImage = "data:image/png;base64," + res.data.pathImage;
        this.partner = res.data;
      }
      this.spinnerService.hide()
    })
  }
}
