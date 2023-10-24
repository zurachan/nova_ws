import { Component, OnInit } from '@angular/core';
import { AppSettingsService } from '../../shared/services/app-settings.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  /**
   *
   */
  constructor(private service: AppSettingsService) { }
  menu = [];

  ngOnInit(): void {
    this.getMenu();
  }

  getMenu() {
    let url = '/assets/config/menu.config.json';
    this.service.getJSON(url).subscribe((res) => {
      this.menu = res;
      console.log(this.menu)
    });
  }

}
