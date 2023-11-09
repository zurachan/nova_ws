import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { RoleService } from '../../../shared/services/role.service';
import { Subscription, forkJoin } from 'rxjs';
import { UserRoleService } from '../../../shared/services/user-role.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css']
})
export class PermissionComponent implements OnInit {

  constructor(private userService: UserService, private roleService: RoleService, private userRoleService: UserRoleService) { }
  subscriptions: Subscription[] = [];

  roles = [];
  users = [];
  userRoles = [];

  ngOnInit() {
    const subscription = forkJoin([this.getUser(), this.getRole(), this.getUserRole()])
      .subscribe(([userRes, roleRes, userRoleRes]: any) => {
        this.users = userRes.data;
        this.roles = roleRes.data;
        this.userRoles = userRoleRes.data;
      });
    this.subscriptions.push(subscription);
  }
  getUser() {
    return this.userService.GetAll({ pageNumber: 1, pageSize: 10000, user: null }).pipe();
  }
  getRole() {
    return this.roleService.GetAll({ pageNumber: 1, pageSize: 10000, user: null }).pipe();
  }
  getUserRole() {
    return this.userRoleService.GetAllUserRoles().pipe();
  }

  // checkExisted(userId: number, roleId: number): boolean {
  //   let userRole = this.userRoles.find(x => x.userId == userId && x.roleId == roleId);
  //   return userRole ? true : false;
  // }

}
