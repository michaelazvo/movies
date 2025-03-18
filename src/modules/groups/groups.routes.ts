import { Routes } from "@angular/router";
import { GroupsListComponent } from "./groups-list/groups-list.component";
import { GroupsMenuComponent } from "./groups-menu/groups-menu.component";
import { GroupEditComponent } from "./group-edit/group-edit.component";
import { GroupNewComponent } from "./group-new/group-new.component";

export const GROUPES_ROUTES: Routes = [
    {path: '', 
        component: GroupsMenuComponent,
        children: [
            {path: '', component: GroupsListComponent},
            {path: 'edit/:id', component: GroupEditComponent},
            {path: 'new', component: GroupNewComponent}
        ]
    }

]