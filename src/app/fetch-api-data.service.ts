import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

// Declaring the api url that will provide data for the client app
const apiUrl = 'https://desolate-everglades-87695-c2e8310ae46d.herokuapp.com/';

/**
 * @description Service for user registration operations.
 * @injectable
 */
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  /**
    * @constructor
    * @param {HttpClient} http - Angular's HttpClient module for making HTTP requests.
    * @param {DataService} dataService - Service for handling shared data between components.
    */
  constructor(private http: HttpClient) {}

  /**
    * @description Make an API call for user registration.
    * @param {any} userDetails - User details for registration.
    * @returns {Observable<any>} - Observable for the API response.
    */
  public userRegistration(userDetails: any): Observable<any> {
    //console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
    * @description Make an API call for user login.
    * @param {any} userDetails - User details for login.
    * @returns {Observable<string>} - Observable for the API response containing the user token.
    */
  public userLogin(userDetails: any): Observable<any>{
    //console.log(userDetails);
    //console.log(apiUrl + 'login?Username=' + userDetails.Username + '&Password=' + userDetails.Password);
    return this.http.post(apiUrl + 'login?Username=' + userDetails.Username + '&Password=' + userDetails.Password, userDetails).pipe(
      catchError(this.handleError)
    );
  }

   /**
    * @description Make an API call to retrieve all movies.
    * @returns {Observable<any>} - Observable for the API response containing all movies.
    */
  getAllMovies(): Observable<any> {
    //console.log('getallmovies called'); 
    const token = localStorage.getItem('token');
    //console.log('Token:', token);
    return this.http.get(apiUrl + 'movies', {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
    * @description Make an API call to retrieve a single movie.
    * @param {string} movieID - ID of the movie to be retrieved.
    * @returns {Observable<any>} - Observable for the API response containing the requested movie.
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
    * @description Make an API call to retrieve a director by name.
    * @param {string} directorName - Name of the director to be retrieved.
    * @returns {Observable<any>} - Observable for the API response containing the requested director.
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
    * @description Make an API call to retrieve a genre by name.
    * @param {string} genreName - Name of the genre to be retrieved.
    * @returns {Observable<any>} - Observable for the API response containing the requested genre.
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
    * @description Make an API call to retrieve a user
    * @returns {Observable<any>} - Observable for the API response containing the requested user.
    */
  getOneUser(): Observable< any >{
    const token = localStorage.getItem('token');

    return this.http.get(apiUrl + 'users', {
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
    * @description Make an API call to retrieve a user's favorite movies
    * @param {string} username - Name of the user to be retrieved.
    * @returns {Observable<any>} - Observable for the API response containing the favorite movies of the requested user.
    */
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
    * @description Make an API call to add a favorite movie for a user.
    * @param {string} userID - ID of the user.
    * @param {string} movieID - ID of the movie to be added to favorites.
    * @returns {Observable<any>} - Observable for the API response.
    */
  addfavoriteMovies(movieId: string): Observable<any>{
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}' );
    user.FavoriteMovies.push(movieId); 
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
    * @description Make an API call to update user information.
    * @param {string} userID - ID of the user to be updated.
    * @param {any} userInfo - New user information.
    * @returns {Observable<any>} - Observable for the API response.
    */
  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + user.Username, updatedUser, {
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
    * @description Make an API call to delete a user.
    * @param {string} userID - ID of the user to be deleted.
    * @returns {Observable<any>} - Observable for the API response.
    */
  deleteOneUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    return this.http.delete(apiUrl + 'users/' + user.Username, {headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
    * @description Make an API call to delete a favorite movie for a user.
    * @param {string} userID - ID of the user.
    * @param {string} movieID - ID of the movie to be removed from favorites.
    * @returns {Observable<any>} - Observable for the API response.
    */
  deleteFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const index = user.FavoriteMovies.indexOf(movieId);
    if(index > -1){
      user.FavoriteMovies.splice(index, 1)  // remove the movieId from array
    }
    localStorage.setItem('user', JSON.stringify(user)); // update the user object in localStorage

    return this.http.delete(apiUrl + 'users/' + user.username + '/favorites/' + movieId, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }),
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
    * @description Extract non-typed response data from the API response.
    * @param {any} res - API response.
    * @returns {any} - Extracted response data.
    * @private
    */
  private extractResponseData(res: any): any {
    const body = res;
    return body || { };
  }

  /**
    * @description Handle HTTP errors and log them.
    * @param {HttpErrorResponse} error - HTTP error response.
    * @returns {any} - Error details.
    * @private
    */
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