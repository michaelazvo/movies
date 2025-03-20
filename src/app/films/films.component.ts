import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { Film } from '../../entities/film';
import { FilmsService } from '../../services/films.service';

@Component({
  selector: 'app-films',
  imports: [MaterialModule],
  templateUrl: './films.component.html',
  styleUrl: './films.component.css'
})
export default class FilmsComponent implements OnInit{
  
  filmsService = inject(FilmsService);
  columnsToDisplay = ['id', 'nazov', 'rok'];
  films: Film[] = [];

  ngOnInit(): void {
    this.filmsService.getFilms('slovenskyNazov', false, 0, 5).subscribe(filmsResponse => {
        this.films = filmsResponse.items;
        console.log('filmsResponse', filmsResponse)
  })
  }
}
