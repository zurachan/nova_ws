import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleDetailComponent } from '../../../page/system/role/role-detail/role-detail.component';
import { NotifierService } from 'angular-notifier';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.css']
})
export class DeleteConfirmComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DeleteConfirmComponent>,
    private notifier: NotifierService,
    private roleService: RoleService) {
    this.modal = data
  }
  modal: any

  ngOnInit() {
  }
  onConfirm() { }
}