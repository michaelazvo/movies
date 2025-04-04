import { AfterViewInit, Component, computed, effect, inject, OnInit, signal, viewChild } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { Film } from '../../entities/film';
import { FilmsService } from '../../services/films.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {rxResource, toObservable, toSignal} from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { UsersService } from '../../services/users.service';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-films',
  imports: [MaterialModule, RouterLink],
  templateUrl: './films.component.html',
  styleUrl: './films.component.css'
})
export default class FilmsComponent implements AfterViewInit{
  
  filmsService = inject(FilmsService);
  usersService = inject(UsersService);
  dialog = inject(MatDialog);
  msgService = inject(MessageService);
  
  columnsToDisplayS = computed(() => this.usersService.loggedUserS() 
                                ? ['id', 'nazov', 'rok', 'slovenskyNazov', 'afi1998', 'afi2007', 'actions']
                                : ['id', 'nazov', 'rok']);

  paginatorS = viewChild.required<MatPaginator>(MatPaginator);
  sortHeaderS = viewChild.required<MatSort>(MatSort);

  orderByS = signal<string | undefined>(undefined);
  descendingS = signal<boolean | undefined>(undefined);
  indexFromS = signal<number | undefined>(0);
  indexToS = signal<number | undefined>(5);
  searchS = signal<string | undefined>(undefined);

  queryS = computed(() => new Query(this.orderByS(), 
                                    this.descendingS(), 
                                    this.indexFromS(), 
                                    this.indexToS(),
                                    this.searchS()
                                  ));

 // response$ = toObservable(this.queryS).pipe(
 //   tap(query => console.log("request:", query)),
 //   switchMap(query => this.filmsService.getFilms(query.orderBy, query.descending, query.indexFrom, query.indexTo, query.search))
 // );

 // responseS = toSignal(this.response$);
  filmsResource = rxResource({
    request: () => this.queryS(),
    loader: ({request: query}) => this.filmsService.getFilms(query.orderBy, query.descending, query.indexFrom, query.indexTo, query.search)
  });

  responseS = this.filmsResource.value;

  filmsS = computed(() => this.responseS()?.items || []);


  constructor(){
    effect(() => console.log(this.responseS()));
  }


  ngAfterViewInit(): void {
    this.paginatorS().page.subscribe(pageEvent => {
      console.log("Page event: ", pageEvent)
      this.indexFromS.set(pageEvent.pageIndex * pageEvent.pageSize);
      this.indexToS.set(Math.min((pageEvent.pageIndex + 1)* pageEvent.pageSize, pageEvent.length))
    });
    this.sortHeaderS().sortChange.subscribe(sortEvent => {
      console.log("Sort header event: ", sortEvent)
      if (sortEvent.direction === ""){
        this.descendingS.set(undefined);
        this.orderByS.set(undefined);
        return 
      }
      this.descendingS.set(sortEvent.direction === "desc");
      let column = sortEvent.active;
      if(column === 'afi1998') column = 'poradieVRebricku.AFI 1998' //tu si viem dat za bodku aj vlastny rebricek kebyze mam
      if(column === 'afi2007') column = 'poradieVRebricku.AFI 2007'
      this.orderByS.set(column);
      this.paginatorS().firstPage();
    })
  }

  filter(event: any){
    const filter = (event.target.value as string).trim().toLowerCase();
    this.searchS.set(filter);
    this.paginatorS().firstPage();

  }

  deletefilm(film: Film) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogData('Deleting film', `Are you sure you want to delete film ${film.nazov}?`)
    });
  
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.filmsService.deleteFilm(film.id!).subscribe({
          next: () => {
            this.msgService.success('Film ' + film.nazov + ' deleted');
            this.filmsResource.reload(); 
          },
          error: (err: { message: string; }) => {
            this.msgService.error('Failed to delete film: ' + err.message);
          }
        });
      }
    });
  }
}

class Query {
  constructor(
    public orderBy?: string, 
    public descending?: boolean, 
    public indexFrom?: number, 
    public indexTo?: number, 
    public search?: string
  ){}

}
