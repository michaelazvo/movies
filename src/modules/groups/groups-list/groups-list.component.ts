import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { Group } from '../../../entities/group';
import { MaterialModule } from '../../material.module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-groups-list',
  imports: [MaterialModule, RouterLink],
  templateUrl: './groups-list.component.html',
  styleUrl: './groups-list.component.css'
})
export class GroupsListComponent implements OnInit{
  
  usersService = inject(UsersService);
  groups: Group[] = [];
  columnsToDisplay = ['id', 'name', 'permissions', 'actions']
  
  ngOnInit(): void {
    this.usersService.getGroups().subscribe(groups => this.groups = groups);

  }

  deleteGroup(group: Group){

  }
}

