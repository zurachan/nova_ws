import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router, private activeRoute: ActivatedRoute) { }
  currentRoute = '';

  menu = [
    { name: "Trang chủ", class: "nav-item", link: "" },
    { name: "Giới thiệu", class: "nav-item", link: "about" },
    {
      name: "Dự án", class: "nav-item dropdown", link: "project", children: [
        { name: "Bất động sản đô thị", link: "project/urban" },
        { name: "Bất động sản du lịch", link: "project/tourism" },
        { name: "Bất động sản công nghiệp", link: "project/industrial" }
      ]
    },
    {
      name: "Tin tức", class: "nav-item dropdown", link: "", children: [
        { name: "Bài viết", link: "content" },
        { name: "Sự kiện", link: "event" }
      ]
    },
    { name: "Liên hệ", class: "nav-item", link: "contact" }
  ]

  ngOnInit() { }

  onChangPage(menuItem) {
    this.menu.forEach(item => {
      if (item.class.includes("active")) {
        let classArr = item.class.split(' ');
        let remove = classArr.pop();
        item.class = classArr.toString().replaceAll(',', ' ');
      }
    })
    menuItem.class += " active";
  }
}
