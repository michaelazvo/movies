import { Component, Input } from '@angular/core';
import { Group } from '../../../entities/group';

@Component({
  selector: 'app-group-edit-child',
  imports: [],
  templateUrl: './group-edit-child.component.html',
  styleUrl: './group-edit-child.component.css'
})
export class GroupEditChildComponent {
  @Input("groupToEdit") group: Group = new Group('');

}
