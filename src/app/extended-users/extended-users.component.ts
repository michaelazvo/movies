import { Component, inject, OnInit } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { UsersService } from '../../services/users.service';
import { User } from '../../entities/user';
import { DatePipe } from '@angular/common';
import { GroupsToStringPipe } from '../../pipes/groups-to-string.pipe';
import {MatIconModule} from '@angular/material/icon';
import { MessageService } from '../../services/message.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-extended-users',
  imports: [MatTableModule, DatePipe, GroupsToStringPipe, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './extended-users.component.html',
  styleUrl: './extended-users.component.css'
})
export class ExtendedUsersComponent implements OnInit{
  usersService = inject(UsersService);
  msgService = inject(MessageService);
  dialog = inject(MatDialog);

  users: User[] = [];
  columnsToDisplay = ['id','name','email','active','lastLogin', 'groups', 'permissions', 'actions'];

  ngOnInit(){
    this.loadUsers();
  }

  loadUsers(){
    this.usersService.getExtendedUsers().subscribe(users => {
      this.users = users;
      console.log(users);
  });
  }

  deleteUser(user: User){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                    data: new ConfirmDialogData('Deleting user',
                      'Are you sure you want to delete user '+user.name+'?')});
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if(result){
        this.usersService.deleteUser(user.id!).subscribe(success => {
          this.msgService.success('User ' + user.name + ' deleted');
          this.loadUsers();
        })
      }
    });
  
  }
}
