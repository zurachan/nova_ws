import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-unauthenticated',
  templateUrl: './unauthenticated.component.html',
  styleUrls: ['./unauthenticated.component.css']
})
export class UnauthenticatedComponent implements OnInit {

  /**
   *
   */
  constructor(private router: Router, private location: Location) {
  }

  ngOnInit(): void {
    if (this.location.path() == '') {
      this.router.navigate(['login'])
    }
  }
}
