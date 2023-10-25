import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectDetailComponent } from './project-detail/project-detail.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.getData();
  }

  getData() { }

  onAdd() {
    const dialogRef = this.dialog.open(ProjectDetailComponent, {
      data: {
        title: 'Tạo mới dự án',
        type: "add"
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.getData()
      }
    });
  }
}
