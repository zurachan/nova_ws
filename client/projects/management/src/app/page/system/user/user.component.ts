import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { DeleteConfirmComponent } from '../../../shared/component/delete-confirm/delete-confirm.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private userService: UserService, private dialog: MatDialog) { }

  userData = [];

  displayedColumns: string[] = ['stt', 'fullName', 'telephone', 'email', 'address'];


  ngOnInit() {
    this.getData()
  }
  getData() {
    this.userService.GetAll().subscribe((res: any) => {
      if (res.success) {
        res.data.map((x: any) => {
          x.stt = res.data.indexOf(x) + 1;
          return x;
        });
        this.userData = res.data
        console.log(this.userData)
      }
    });
  }

  onAdd() { }

  onEdit(item: any) {
    const dialogRef = this.dialog.open(UserDetailComponent, {
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

  onDelete(item: any) {
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      data: {
        title: 'Nhân viên',
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
