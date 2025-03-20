import { Component, inject, Input, OnInit } from '@angular/core';
import { GroupEditChildComponent } from "../group-edit-child/group-edit-child.component";
import { Group } from '../../../entities/group';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-group-edit',
  imports: [GroupEditChildComponent],
  templateUrl: './group-edit.component.html',
  styleUrl: './group-edit.component.css'
})
export class GroupEditComponent implements OnInit{
  router = inject(Router);
  route = inject(ActivatedRoute);
  usersService = inject(UsersService);
  group?: Group;

  ngOnInit(): void {
    //this.route.paramMap.pipe(
      //map(params => Number(params.get('id'))),
     // switchMap(groupId => this.usersService.getGroup(groupId))
    //).subscribe(group => this.group = group)

    this.route.data.subscribe(data => {
      this.group = data['group'];
    })
  }

  saveGroup(groupToSave: Group){
    this.usersService.saveGroup(groupToSave).subscribe(saved => {
      this.router.navigate(['../../'], {relativeTo: this.route});
    });

  }

}
