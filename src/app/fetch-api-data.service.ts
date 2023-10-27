import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://movieapi-lcrt.onrender.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
 // This will provide HttpClient to the entire class, making it available via this.http
 constructor(private http: HttpClient){
 }
  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any):Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    )
  }

  // Making the api call for the user login endpoint
  public userLogin(userDetails: any):Observable<any> {
    return this.http.post(apiUrl + 'login',userDetails).pipe(
      catchError(this.handleError)
    )
  }
  
  // Making the api call for the get all movies endpoint
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', 
    {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the api call for the get one movie endpoint
  getOneMovies(Title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + Title, 
    {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the api call for the get director endpoint
  getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/director_description/' + directorName, 
    {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the api call for the get genre endpoint
  getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre_description/' + genreName, 
    {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
  // Making the api call for the get user endpoint
  getUser(): Observable<any> {
    const user = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + user, 
    {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
  // Making the api call for the get user fav movies endpoint
  getFavMovies(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username, 
    {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      map((data) => data.FavoriteMovies),
      catchError(this.handleError)
    );
  }
  // Making the api call for the add movie to fav list endpoint
  addFavMovies(movieId: string): Observable<any> {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user) {
      if (!user.FavoriteMovies) {
        user.FavoriteMovies = []; // Initialize FavoriteMovies array if it doesn't exist
      }
      user.FavoriteMovies.push(movieId);
      localStorage.setItem('user', JSON.stringify(user));

      const token = localStorage.getItem('token');

      return this.http.put(apiUrl + `users/${user.Username}/${movieId}`, {}, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
    }
  }

  // Handle the case where the user object is null or parsing fails
  return throwError(() => new Error('User not found'));
}

editUser(updateUser:any): Observable<any> {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user) {
      const token = localStorage.getItem('token');
      return this.http.put(apiUrl + 'users/' + user.Username, updateUser, {
        headers: new HttpHeaders({
          Authorization: 'Bearer' + token,
        })
      }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
    }
  } 
  return throwError(() => new Error('user not found'));
}

deleteUser(): Observable <any> {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user) {
      const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + user._id , 
    {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
        );
      }
    }
    return throwError(() => new Error( 'user not found'))
  }

deleteFavMovies(movieId: string): Observable<any> {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user) {
      const token = localStorage.getItem('token');
      const index = user.FavoriteMovies.indexOf(movieId);
        if(index >= 0) {
          user.FavoriteMovies.splice(index, 1);
        }
      return this.http.delete(apiUrl + `users/${user.Username}/${movieId}`, 
      {headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
      }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
    }
  }
  return throwError(() => new Error('user not found'))
}

  // Non-typed response extraction
  private extractResponseData(res: Object): any {
    const body = res;
    return body || { };
  }

  private handleError(error: HttpErrorResponse): any {
    if(error.error instanceof ErrorEvent) {
      console.error('some error occured:', error.error.message )
    } else {
      console.error(
        `Error Status Code ${error.status},` +
        `Error body is: ${error.error}`
      );
    }
    return throwError(() => new Error('something bad happened; please try again later'))
  }
}

