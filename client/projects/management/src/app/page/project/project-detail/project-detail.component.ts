import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';

interface data {
  title: string,
  type: "add" | "edit"
  item: any | null;
}

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: data,
    private dialogRef: MatDialogRef<ProjectDetailComponent>,
    private fb: FormBuilder,
    private notifier: NotifierService,) {
    this.modal = data;
  }

  form: FormGroup;
  modal: any;

  ngOnInit() {
    this.initForm();
    this.bindValueForm();
  }

  initForm() {
    this.form = this.fb.group({
      id: [null],
      name: [null, Validators.required]
    })
  }

  bindValueForm() {
    this.form.patchValue(this.modal.item);
  }

  onSave() { }
}
