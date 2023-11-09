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
        this.userRoles = userRoleRes.data;

        this.roles = roleRes.data.map((role: any) => {
          let userRoles = this.userRoles.filter(ur => ur.roleId == role.id).map(ur => ur.userId);
          let usersHasRole = this.users.filter(ur => userRoles.includes(ur.id))
          role.listUser = [];
          usersHasRole.forEach(x => { role.listUser.push(x) })
          role.listUser = role.listUser.map(x => x.fullName).toString();
          return role;
        });
      });
    this.subscriptions.push(subscription);
  }
  getUser() {
    return this.userService.GetPagingData({ pageNumber: 1, pageSize: 10000, user: null }).pipe();
  }
  getRole() {
    return this.roleService.GetPagingData({ pageNumber: 1, pageSize: 10000, user: null }).pipe();
  }
  getUserRole() {
    return this.userRoleService.GetAllUserRoles().pipe();
  }

  getData() {

  }


  onAddUserRole(roleId: number) {
    alert(roleId)
  }

}
