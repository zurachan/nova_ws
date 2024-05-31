import { environment } from '../environments/environment';
import { AuthenticateService } from './shared/services/authenticate.service';
import { Component, OnInit, isDevMode } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Client';
  // IsAuthenticated!: boolean;

  /**
   *
   */
  constructor(private authenticateService: AuthenticateService) {}
  ngOnInit(): void {}

  IsAuthenticated() {
    return this.authenticateService.LoggedIn;
  }

  Logout() {
    this.authenticateService.Logout();
  }
}
