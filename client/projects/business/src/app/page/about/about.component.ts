import { Component, OnInit } from '@angular/core';
import { PartnerService } from 'projects/management/src/app/shared/services/partner.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private partnerService: PartnerService) { }

  partners = [];

  ngOnInit() {
    this.partnerService.GetPagingData({ partner: "", pageNumber: 1, pageSize: 5 }).subscribe((res: any) => {
      if (res.success) {
        res.data.map(x => {
          x.pathImage = "data:image/png;base64," + x.pathImage;
          return x;
        })
        this.partners = res.data;
      }
    })
  }
}
