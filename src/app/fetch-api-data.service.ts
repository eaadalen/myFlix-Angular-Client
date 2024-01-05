import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';


// Declaring the api url that will provide data for the client app
const apiUrl = 'https://desolate-everglades-87695-c2e8310ae46d.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

// Inject the HttpClient module to the constructor params
 // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) { }

  /**
 * Making the api call for the user registration endpoint
 * @param userDetails 
 * @returns user registered
 */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
    catchError(this.handleError));
  }

    /**
 * Making the api call for the user login endpoint
 * @param userDetails 
 * @returns user logged in
 */
  public userLogin(userDetails: any): Observable<any>{
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

    /**
 * Making the api call for getting all movies endpoint
 * @returns all movies
 * @throws error
 */
    getAllMovies(): Observable<any> {
      console.log('getallmovies called'); 
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    return this.http.get(apiUrl + 'movies', {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
 * Making the api call for getting one movie endpoint
 * @param title 
 * @returns one movie
 *  @throws error
 */
      getOneMovie(title: string): Observable<any>{
        const token = localStorage.getItem('token');
        return this.http.get(apiUrl + 'movies/' + title, {headers: new HttpHeaders(
          {
            Authorization: 'Bearer ' + token,
        }
        )}).pipe(
          map(this.extractResponseData),
          catchError(this.handleError)
        );
      }

    /**
 * Making the api call for getting director endpoint
 * @param directorName 
 * @returns director's details
 * @throws error
 */
    getOneDirector(directorName:string): Observable< any >{
      const token = localStorage.getItem('token');
      return this.http.get(apiUrl + 'movies/director/' + directorName, {headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }
      )}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      )
    }

    /**
 * Making the api call for getting genre endpoint
 * @param genreName 
 * @returns genre's details
 * @throws error
 */
    getOneGenre(genreName:string): Observable< any >{
      const token = localStorage.getItem('token');
      return this.http.get(apiUrl + 'movies/genre/' + genreName, {headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }
      )}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      )
    }

    /**
 * Making the api call for getting user endpoint
 * @param userName 
 * @returns user's details
 * @throws error
 */
    getOneUser(): Observable< any >{
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}')

      return this.http.get(apiUrl + 'users/' + user.username, {
        headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }
      )}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      )
    }

    /**
   *  Method to get user's fav movies
   * @returns user's fav movies
   * @throws error
   */
    //
    getfavoriteMovies(username: string): Observable< any >{
      const token = localStorage.getItem('token');
      return this.http.get(apiUrl + 'users/' + username, {headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }
      )}).pipe(
        map(this.extractResponseData),
        map((data) => data.favorite_movies),
        catchError(this.handleError)
      )
    }
/**
 * Making the api call for adding user's fav movie endpoint
 * @param movieId 
 * @returns user's fav movie added
 * @throws error
 */

    addfavoriteMovies(movieId: string): Observable<any>{
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}' );
      console.log('Before:', user.favorite_movies);

      user.favorite_movies.push(movieId); // Update the FavoriteMovies array
      console.log('After:', user.favorite_movies);
      localStorage.setItem('user', JSON.stringify(user)); // Update the user object in localStorage
      
      return this.http.post(apiUrl + 'users/' + user.username + '/movies/' + movieId, {}, {
        headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }
      )}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      )
    }

    /**
 * Making the api call for updating user endpoint
 * @param updatedUser 
 * @returns user's details updated
 * @throws error
 */
editUser(updatedUser: any): Observable<any> {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token');
  return this.http.put(apiUrl + 'users/' + user.username, updatedUser, {
    headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

/**
 * Making the api call for deleting user endpoint
 * @returns user's details deleted
 * @throws error
 */

deleteOneUser(): Observable<any> {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  return this.http.delete(apiUrl + 'users/' + user.username, {
    headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
  }).pipe(
    // map(this.extractResponseData),
    catchError(this.handleError)
  );
}

/**
 * Making the api call for deleting user's fav movie endpoint
 * @param movieId 
 * @returns  user's fav movie deleted
 */
deleteFavoriteMovie(movieId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const index = user.favorite_movies.indexOf(movieId);
  if(index > -1){
    user.favorite_movies.splice(index, 1)  // remove the movieId from array
  }
  localStorage.setItem('user', JSON.stringify(user)); // update the user object in localStorage

  return this.http.delete(apiUrl + 'users/' + user.username + '/movies/' + movieId, {
    headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      }),
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || { };
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
    console.error('Some error occurred:', error.error.message);
    } else {
    console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}