import { NgModule } from '@angular/core';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { RouterModule } from '@angular/router';
import { GROUPES_ROUTES } from './groups.routes';



@NgModule({
  declarations: [],
  imports: [
    GroupsListComponent,
    RouterModule.forChild(GROUPES_ROUTES)
  ]
})
export default class GroupsModule { }
