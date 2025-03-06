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

@Component({
  selector: 'app-user-edit',
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule, MatSlideToggleModule, MatCheckboxModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit{
  usersService = inject(UsersService);
  
  titleS = signal('New user');
  hide = true;
  allGroups : Group[] = [];

  userModel = new FormGroup({
    name: new FormControl('', {validators: [Validators.required]}),
    email: new FormControl('',{validators: [Validators.required, 
                                            Validators.email,
                                            Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+[.]{1,1}[a-zA-Z0-9-.]{2,}$")]}),
    password: new FormControl('', {validators: [Validators.required]}),
    active: new FormControl(true),
    groups: new FormArray([])
  });

  ngOnInit(): void {
    this.usersService.getGroups().subscribe(groups => {
      this.allGroups = groups;
      this.allGroups.forEach(group => {
        this.groups.push(new FormControl(false));
      });
    });
  }

  save() {
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
  get groups(): FormArray {
    return this.userModel.get('groups') as FormArray;
  }
}
