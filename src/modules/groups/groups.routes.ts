import { Routes } from "@angular/router";
import { GroupsListComponent } from "./groups-list/groups-list.component";
import { GroupsMenuComponent } from "./groups-menu/groups-menu.component";
import { GroupEditComponent } from "./group-edit/group-edit.component";
import { GroupNewComponent } from "./group-new/group-new.component";
import { authGuard } from "../../guards/auth.guard";
import { authAsyncGuard } from "../../guards/auth-async.guard";

export const GROUPES_ROUTES: Routes = [
    {path: '', 
        component: GroupsMenuComponent,
        children: [
            {path: '', component: GroupsListComponent},
            {path: 'edit/:id', component: GroupEditComponent, canActivate:[authAsyncGuard]},
            {path: 'new', component: GroupNewComponent, canActivate:[authAsyncGuard]}
        ]
    }

]