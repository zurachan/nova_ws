import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppSettingsService } from 'projects/management/src/app/shared/services/app-settings.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService,
    private appSettingsService: AppSettingsService) { }

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
    this.getCommonInfo();
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
