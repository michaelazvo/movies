import { Component } from '@angular/core';
import { GroupEditChildComponent } from '../group-edit-child/group-edit-child.component';
import { Group } from '../../../entities/group';

@Component({
  selector: 'app-group-new',
  imports: [GroupEditChildComponent],
  templateUrl: './group-new.component.html',
  styleUrl: './group-new.component.css'
})
export class GroupNewComponent {
  group = new Group("new group");
}
