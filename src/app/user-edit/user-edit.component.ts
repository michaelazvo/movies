import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Group } from '../../entities/group';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../entities/user';
import { map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-user-edit',
  imports: [MatCardModule , MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule, MatSlideToggleModule, MatCheckboxModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit{
  usersService = inject(UsersService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  titleS = signal('New user');
  hide = true;
  userId? : number;
  inputUser? : User;
  allGroups : Group[] = [];

  userModel = new FormGroup({
    name: new FormControl('', {validators: [Validators.required]}),
    email: new FormControl('',{validators: [Validators.required, 
                                            Validators.email,
                                            Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+[.]{1,1}[a-zA-Z0-9-.]{2,}$")]}),
    password: new FormControl(''),
    active: new FormControl(true),
    groups: new FormArray([])
  });

  ngOnInit(): void {
    //this.userId = this.route.snapshot.params['id'];

    this.route.paramMap.pipe(
      map(params => Number(params.get('id')) || undefined),
      tap(userId => {
        this.userId = userId,
        console.log("userId", this.userId);
      }),
      switchMap(userId => userId? this.usersService.getUser(userId) : of(new User('',''))),
      tap(user =>{
        this.inputUser = user;
        this.name.setValue(user.name);
        this.email.setValue(user.email);
        this.active.setValue(user.active);

        //this.userModel.patchValue({
        //name: user.name,
        //  email: user.email,
        //  active: user.active
        //})
      }),
      switchMap(user => this.usersService.getGroups()),
      tap(groups => {
        this.allGroups = groups;
        this.allGroups.forEach(group => {
          const userHasGroup = this.inputUser?.groups.some(ug => ug.id === group.id)
          this.groups.push(new FormControl(userHasGroup));
        });
      })
    ).subscribe();


  }

  save() {
    const groups: Group[] = this.allGroups.filter((g, i) => this.groups.at(i).value);
    const password = (this.password.value || '').trim() || undefined;
    const user = new User(this.name.value, this.email.value, this.userId, undefined, password, this.active.value, groups);
    this.usersService.saveUser(user).subscribe(savedUser => {
        this.router.navigateByUrl('/extended-users');
    })
  }
  printErrors(e: ValidationErrors) {
    return JSON.stringify(e);
  }
  get name(): FormControl<string> {
    return this.userModel.get('name') as FormControl<string>;
  }
  get email(): FormControl<string> {
    return this.userModel.get('email') as FormControl<string>;
  }
  get password(): FormControl<string> {
    return this.userModel.get('password') as FormControl<string>;
  }
  get active(): FormControl<boolean> {
    return this.userModel.get('active') as FormControl<boolean>;
  }
  get groups(): FormArray {
    return this.userModel.get('groups') as FormArray;
  }
}
