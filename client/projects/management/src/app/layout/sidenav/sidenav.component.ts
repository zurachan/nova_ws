import { Component, OnInit } from '@angular/core';
import { AppSettingsService } from '../../shared/services/app-settings.service';
import { AuthenticateService } from '../../shared/services/authenticate.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  /**
   *
   */
  constructor(private service: AppSettingsService, private authenService: AuthenticateService) {
    this.credential = this.authenService.GetCredential;
    if (this.credential) {
      this.roles = this.credential.role.map((x: any) => x.role.name)
    }
  }

  menu = [];
  roles = [];
  credential: any;

  ngOnInit(): void {
    this.getMenu();
    this.authenService.updateCredential.subscribe((res: any) => { this.credential = res; })
  }

  getMenu() {
    let url = '/assets/config/menu.config.json';
    this.service.getJSON(url).subscribe((res) => {
      this.menu = res;
      this.menu = this.menu.map(x => {
        let found = x.permission.some(r => this.roles.includes(r))
        x.isShow = found ? true : false
        return x;
      })
      this.menu = this.menu.filter(x => x.isShow);
      console.log(this.menu)

    });
  }

}
