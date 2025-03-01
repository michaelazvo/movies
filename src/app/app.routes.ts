import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { ExtendedUsersComponent } from './extended-users/extended-users.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    {path: 'users', component: UsersComponent },
    {path: 'extended-users', component: ExtendedUsersComponent},
    {path: 'login', component: LoginComponent },
    {path: 'register', component: RegisterComponent},
    {path: '', redirectTo: '/login', pathMatch:'full'},
    {path: '**', component: PageNotFoundComponent}
];
