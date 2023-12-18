import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
/** API url for getting data 
 * This fetch-api-data contains endpoints that allow the application to perform various functions
 * such as creating new uers, logging in as an existing user, getting a list of all movies, getting 
 * information about genres, directors, and movie summaries. The endpoints also allow for updating 
 * and deleting existing user profiles
*/
// use for RENDER server
// const apiUrl = 'https://movieapi-lcrt.onrender.com/';

// use for AWS EC2 server
const apiUrl = 'http://ec2-34-195-61-150.compute-1.amazonaws.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
 // This will provide HttpClient to the entire class, making it available via this.http
 constructor(private http: HttpClient){
 }


  // Making the api call for the user registration endpoint
  /**
  *  Makes the API call for the user registration endpoint.
  * @param userDetails The details entered into the user registration form
  * @returns http POST request
  */
  public userRegistration(userDetails: any):Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    )
  }

  // Making the api call for the user login endpoint
  /**
  *  Makes the API call for the user login endpoint.
  * @param userDetails The details entered into the user registration form
  * @returns http POST request
  */
  public userLogin(userDetails: any):Observable<any> {
    return this.http.post(apiUrl + 'login',userDetails).pipe(
      catchError(this.handleError)
    )
  }
  
  // Making the api call for the get all movies endpoint
   /**
  *  Makes the API call for the get all movies endpoint
  * @param none
  * @returns http GET request
  */
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

  // funciton to update user data from backend
  // updateUserData(): void {
  //   const user = this.getUser().subscribe((userData: any) => {
  //     localStorage.setItem('user', JSON.stringify(userData));
  //   });
  // }

  // Making the api call for the get one movie endpoint
   /**
  *  Makes the API call for endpoint to get a single movie
  * @param Title The title of the movie
  * @returns http GET request
  */
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
  /**
  *  Makes the API call for endpoint to get director information
  * @param DirectorName The name of the director
  * @returns http GET request
  */
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
  /**
  *  Makes the API call for endpoint to get genre information
  * @param genreName The name of the genre
  * @returns http GET request
  */
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
    /**
  *  Makes the API call for the get user endpoint
  * @param none
  * @returns http GET request
  */
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
    /**
  *  Makes the API call for endpoint to get favorite movies
  * @param username The username is needed to get the favorite movies specific to each user
  * @returns http GET request
  */
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
    /**
  *  Makes the API call to add movies to the favorite list
  * @param MovieId The id of the movie to add to the favoritemovies array
  * @returns http POST request
  */
  addFavMovies(movieId: string): Observable<any> {
  const userStr = localStorage.getItem('user');

  console.log('add movie to favorites: ' + movieId);
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user) {
      if (!user.FavoriteMovies) {
        user.FavoriteMovies = []; // Initialize FavoriteMovies array if it doesn't exist
      }
      user.FavoriteMovies.push(movieId);
      localStorage.setItem('user', JSON.stringify(user));

      const token = localStorage.getItem('token');

      return this.http.post(apiUrl + `users/${user.Username}/` + 'movies/' + `${movieId}`, {}, {
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

//making API call to edit user information
  /**
  *  Makes the API call for endpoint to edit user information
  * @param updateUser 
  * @returns http PUT request
  */
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

//making API call to delete existing user profile 
  /**
  *  Makes the API call for endpoint to delete a user profile
  * @param none
  * @returns http DELETE request
  */
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

  /**
  *  Makes the API call to delete movies from the favorite list
  * @param movieId The id of the movie to delete from the favoritemovies array
  * @returns http DELETE request
  */
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
      localStorage.setItem('user', JSON.stringify(user));
      return this.http.delete(apiUrl + `users/${user.Username}/` + 'movies/' + `${movieId}`, 
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

//checks if the favoite movies array has movieID
isFavoriteMovie(movieID: string): boolean {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.FavoriteMovies.indexOf(movieID) >= 0;
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

