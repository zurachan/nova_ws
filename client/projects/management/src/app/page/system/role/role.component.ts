import { Component, OnInit } from '@angular/core';
import { RoleDetailComponent } from './role-detail/role-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { RoleService } from '../../../shared/services/role.service';
import { DeleteConfirmComponent } from '../../../shared/component/delete-confirm/delete-confirm.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  constructor(private roleService: RoleService, private dialog: MatDialog) { }

  roleData = [];

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.roleService.GetAll().subscribe((res: any) => {
      if (res.success) {
        res.data.map((x: any) => {
          x.stt = res.data.indexOf(x) + 1;
          return x;
        });
        this.roleData = res.data
      }
    });
  }

  onEditRole(item: any) {
    const dialogRef = this.dialog.open(RoleDetailComponent, {
      data: {
        title: 'Cập nhật quyền',
        item
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.getData()
      }
    });
  }

  onDeleteRole(item: any) {
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      data: {
        title: 'Quyền',
        item
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.getData()
      }
    });
  }

}
