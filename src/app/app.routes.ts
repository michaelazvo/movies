import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { ExtendedUsersComponent } from './extended-users/extended-users.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { authGuard } from '../guards/auth.guard';

export const routes: Routes = [
    {path: 'users', component: UsersComponent },
    {path: 'extended-users', component: ExtendedUsersComponent, canActivate:[authGuard]},
    {path: 'login', component: LoginComponent },
    {path: 'register', component: RegisterComponent},
    {path: 'user/new', component: UserEditComponent, data: {newUser: true}},
    {path: 'user/edit/:id', component: UserEditComponent, canActivate:[authGuard]},
    {path: 'groups', 
        loadChildren: ()=> import('../modules/groups/groups.module')},
    {path: '', redirectTo: '/login', pathMatch:'full'},
    {path: '**', component: PageNotFoundComponent}
];
