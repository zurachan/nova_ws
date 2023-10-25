import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  @Output() LogoutEvent = new EventEmitter<any>();

  /**
   *
   */
  constructor() { }

  ClickLogOut() {
    this.LogoutEvent.emit();
  }
}
