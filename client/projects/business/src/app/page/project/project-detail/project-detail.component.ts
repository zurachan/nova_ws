import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'projects/management/src/app/shared/services/project.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private projectService: ProjectService) { }

  project = {
    name: null,
    content: null,
    type: null,
    phase: null,
    pathImage: null
  };

  ngOnInit() {
    this.getDetail();
  }

  getDetail() {
    this.projectService.GetById(this.activatedRoute.snapshot.params['id']).subscribe((res: any) => {
      if (res.success) {
        this.project = res.data;
        console.log(this.project)
      }
    })
  }

}
