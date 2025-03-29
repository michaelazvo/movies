import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Film } from '../entities/film';
import { UsersService } from './users.service';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class FilmsService {
  url = environment.restServerUrl;
  http = inject(HttpClient);
  usersService = inject(UsersService)
  msgService = inject(MessageService);

  get token() {
    return this.usersService.token;
  }

  getTokenHeader(): {headers?: {[header: string]: string}, params?: HttpParams} | undefined {
    if(!this.token) {
      return undefined;
    }
    return {headers: {'X-Auth-Token': this.token}}
  }

  getFilms(orderBy?: string, descending?: boolean, indexFrom?: number, indexTo?: number, search?: string): Observable<FilmsResponse>{
    let options = this.getTokenHeader();
    if(orderBy||descending||indexFrom||indexTo||search){
        options = {...(options || {}), params: new HttpParams()};

    }
    if(options && options.params){
      if(orderBy) options.params = options.params.set('orderBy', orderBy);
      if(descending) options.params = options.params.set('descending', descending);
      if(indexFrom) options.params = options.params.set('indexFrom', indexFrom);
      if(indexTo) options.params = options.params.set('indexTo', indexTo);
      if(search) options.params = options.params.set('search', search);

    }
    return this.http.get<FilmsResponse>(this.url + 'films', options).pipe(
        catchError(error => this.usersService.processError(error))
    )
  }

    getFilm(id: number): Observable<Film> {
      return this.http.get<Film>(`${this.url}films/${id}`, this.getTokenHeader()).pipe(
        map(json => Film.clone(json)),
        catchError(err => this.usersService.processError(err))
      );
    }

    saveFilm(film: Film): Observable<Film> {
      return this.http.post<Film>(`${this.url}films`, film, this.getTokenHeader()).pipe(
        map(json => Film.clone(json)),
        catchError(err => this.usersService.processError(err))
      );
    }
  

    
    processError(error:any){
        if(error instanceof HttpErrorResponse){
          if (error.status === 0){
            this.msgService.error('Server not available');
            return EMPTY;
          }
          if(error.status >= 400 && error.status < 500){
            const message = error.error?.errorMessage ? error.error.errorMessage : JSON.parse(error.error).errorMessage;
            this.msgService.error(message);
            return EMPTY;
          }
          console.error(error);
          this.msgService.error("Server error, please contact administrator");
        } else {
          console.error(error);
          this.msgService.error("Your angular developer did something wrong");
        }
        return EMPTY;
          
    }
}



export interface FilmsResponse{
  items: Film[],
  totalCount: number
}
