import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { ExtendedUsersComponent } from './extended-users/extended-users.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { authGuard, authMatchGuard } from '../guards/auth.guard';
import { canDeactivateGuard } from '../guards/can-deactivate.guard';

export const routes: Routes = [
    {path: 'users', component: UsersComponent },
    {path: 'extended-users', component: ExtendedUsersComponent, canActivate:[authGuard]},
    {path: 'login', component: LoginComponent },
    {path: 'register', component: RegisterComponent},
    {path: 'user/new', component: UserEditComponent, data: {newUser: true}},
    {path: 'user/edit/:id', component: UserEditComponent, canActivate:[authGuard], canDeactivate:[canDeactivateGuard]},
    {path: 'groups', 
        loadChildren: ()=> import('../modules/groups/groups.module'),
        canMatch: [authMatchGuard]
    },
    {path: 'chat', loadComponent:() => import('./chat/chat.component').then(mod => mod.ChatComponent)},
    {path: 'films', loadComponent: ()=> import('./films/films.component')},
    {path: '', redirectTo: '/login', pathMatch:'full'},
    {path: '**', component: PageNotFoundComponent}
];
