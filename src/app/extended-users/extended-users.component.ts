import { Component, inject, OnInit } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { UsersService } from '../../services/users.service';
import { User } from '../../entities/user';
import { DatePipe } from '@angular/common';
import { GroupsToStringPipe } from '../../pipes/groups-to-string.pipe';


@Component({
  selector: 'app-extended-users',
  imports: [MatTableModule, DatePipe, GroupsToStringPipe],
  templateUrl: './extended-users.component.html',
  styleUrl: './extended-users.component.css'
})
export class ExtendedUsersComponent implements OnInit{
  usersService = inject(UsersService);
  users: User[] = [];
  columnsToDisplay = ['id','name','email','active','lastLogin', 'groups', 'permissions'];

  ngOnInit(){
    this.usersService.getExtendedUsers().subscribe(users => {
      this.users = users;
      console.log(users);
  });
  }
}
