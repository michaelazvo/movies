import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmsService } from '../../services/films.service';
import { Film } from '../../entities/film';
import { Observable, of } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';
import { CanDeactivateComponent } from '../../guards/can-deactivate.guard';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { Postava } from '../../entities/postava';
import { Person } from '../../entities/person';

@Component({
  selector: 'app-film-edit',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule 
  ],
  templateUrl: './film-edit.component.html',
  styleUrls: ['./film-edit.component.css']
})
export class FilmEditComponent implements OnInit, CanDeactivateComponent {

  filmsService = inject(FilmsService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  dialog = inject(MatDialog);

  titleS = signal('New Film');
  filmId?: number;
  inputFilm?: Film;
  filmSaved = false;
  poradieKeys: string[] = ['AFI 2007', 'AFI 1998'];

  filmModel = new FormGroup({
    nazov: new FormControl('', { validators: [Validators.required] }),
    slovenskyNazov: new FormControl(''),
    rok: new FormControl('', {
      validators: [
        Validators.required,
        Validators.min(1888),
        Validators.max(new Date().getFullYear())
      ]
    }),
    imdbID: new FormControl(''),
    reziser: new FormArray([]),
    postava: new FormArray([]),
    poradieVRebricku: new FormGroup({
      'AFI 2007': new FormControl(''),
      'AFI 1998': new FormControl('')
    })
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => Number(params.get('id')) || undefined),
      tap(id => {
        this.filmId = id;
      }),
      switchMap(id =>
        id ? this.filmsService.getFilm(id) : of(new Film('', 2000, '', '', [], [], {}))
      ),
      tap(film => {
        this.inputFilm = film;
        if (film.id) {
          this.titleS.set('Edit Film');
        }
        this.nazov.setValue(film.nazov);
        this.slovenskyNazov.setValue(film.slovenskyNazov);
        this.rok.setValue(film.rok);
        this.imdbID.setValue(film.imdbID);

        
        const reziserArray = this.filmModel.get('reziser') as FormArray;
        if (film.reziser && film.reziser.length) {
          film.reziser.forEach((director) => {
            reziserArray.push(new FormGroup({
              krstneMeno: new FormControl(director.krstneMeno, { validators: [Validators.required] }),
              stredneMeno: new FormControl(director.stredneMeno),
              priezvisko: new FormControl(director.priezvisko, { validators: [Validators.required] })
            }));
          });
        } else {
          reziserArray.push(new FormGroup({
            krstneMeno: new FormControl('', { validators: [Validators.required] }),
            stredneMeno: new FormControl(''),
            priezvisko: new FormControl('', { validators: [Validators.required] })
          }));
        }

        const postavaArray = this.filmModel.get('postava') as FormArray;
        if (film.postava && film.postava.length) {
          film.postava.forEach((character) => {
            postavaArray.push(new FormGroup({
              name: new FormControl(character.postava, { validators: [Validators.required] }),
              actorKrstneMeno: new FormControl(character.herec?.krstneMeno || '', { validators: [Validators.required] }),
              actorStredneMeno: new FormControl(character.herec?.stredneMeno || ''),
              actorPriezvisko: new FormControl(character.herec?.priezvisko || '', { validators: [Validators.required] }),
              typPostavy: new FormControl(character.dolezitost || 'hlavná postava', { validators: [Validators.required] })
            }));
          });
        } else {
          postavaArray.push(new FormGroup({
            name: new FormControl('', { validators: [Validators.required] }),
            actorKrstneMeno: new FormControl('', { validators: [Validators.required] }),
            actorStredneMeno: new FormControl(''),
            actorPriezvisko: new FormControl('', { validators: [Validators.required] }),
            typPostavy: new FormControl('hlavná postava', { validators: [Validators.required] })
          }));
        }

        const poradieGroup = this.filmModel.get('poradieVRebricku') as FormGroup;
        if (film.poradieVRebricku) {
          if ('AFI 2007' in film.poradieVRebricku) {
            poradieGroup.get('AFI 2007')?.setValue(film.poradieVRebricku['AFI 2007']);
          }
          if ('AFI 1998' in film.poradieVRebricku) {
            poradieGroup.get('AFI 1998')?.setValue(film.poradieVRebricku['AFI 1998']);
          }
        }
      })
    ).subscribe();
  }

  addDirector() {
    this.reziser.push(new FormGroup({
      krstneMeno: new FormControl('', Validators.required),
      stredneMeno: new FormControl(''),
      priezvisko: new FormControl('', Validators.required)
    }));
  }
  
  removeDirector(index: number) {
    this.reziser.removeAt(index);
  }

  addCharacter() {
    this.postava.push(new FormGroup({
      name: new FormControl('', Validators.required),
      typPostavy: new FormControl('hlavná postava', Validators.required),
      actorKrstneMeno: new FormControl('', Validators.required),
      actorStredneMeno: new FormControl(''),
      actorPriezvisko: new FormControl('', Validators.required)
    }));
  }
  
  removeCharacter(index: number) {
      this.postava.removeAt(index);
  }

  newRankingName = '';
  newRankingValue: number | null = null;


  save() {
    const directors = this.reziser.value.map((d: any) =>
      new Person(0, d.krstneMeno, d.stredneMeno, d.priezvisko)
    );
  
    const characters = this.postava.value.map((p: any) =>
      new Postava(
        p.name,
        p.typPostavy,
        new Person(0, p.actorKrstneMeno, p.actorStredneMeno, p.actorPriezvisko)
      )
    );
  
    const film = new Film(
      this.nazov.value,
      this.rok.value,
      this.slovenskyNazov.value,
      this.imdbID.value,
      directors,
      characters,
      this.poradieVRebricku.value,
      this.filmId
    );
  
    this.filmsService.saveFilm(film).subscribe(savedFilm => {
      this.filmSaved = true;
      this.router.navigateByUrl('/films');
    });
  }

  printErrors(e: ValidationErrors) {
    return JSON.stringify(e);
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (this.filmModel.dirty && !this.filmSaved) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: new ConfirmDialogData('Leaving page?',
          'Film is edited but not saved. Do you want to leave the page without saving?')
      });
      return dialogRef.afterClosed();
    }
    return true;
  }

  get nazov(): FormControl {
    return this.filmModel.get('nazov') as FormControl;
  }

  get slovenskyNazov(): FormControl {
    return this.filmModel.get('slovenskyNazov') as FormControl;
  }

  get rok(): FormControl {
    return this.filmModel.get('rok') as FormControl;
  }

  get imdbID(): FormControl {
    return this.filmModel.get('imdbID') as FormControl;
  }

  get reziser(): FormArray {
    return this.filmModel.get('reziser') as FormArray;
  }

  get postava(): FormArray {
    return this.filmModel.get('postava') as FormArray;
  }
  
  get poradieVRebricku(): FormGroup {
    return this.filmModel.get('poradieVRebricku') as FormGroup;
  }

}
