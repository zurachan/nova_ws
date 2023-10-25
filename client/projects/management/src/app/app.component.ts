import { AuthenticateService } from './shared/services/authenticate.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Client';
  // IsAuthenticated!: boolean;

  /**
   *
   */
  constructor(private authenticateService: AuthenticateService) {
  }

  IsAuthenticated() {
    return this.authenticateService.LoggedIn;
  }

  Logout() {
    this.authenticateService.Logout();
  }
}
