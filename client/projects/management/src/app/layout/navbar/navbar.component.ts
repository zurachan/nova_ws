import { AuthenticateService } from './../../shared/services/authenticate.service';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  @Output() LogoutEvent = new EventEmitter<boolean>();

  /**
   *
   */
  constructor(private authenticateService: AuthenticateService) { }

  ClickLogOut() {
    this.LogoutEvent.emit(false);
  }
}
