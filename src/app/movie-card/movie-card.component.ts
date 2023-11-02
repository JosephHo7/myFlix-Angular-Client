import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponent } from '../movie-info/movie-info.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] =[];
  user: any = {};
  favoritesMap: { [movieId: string]: boolean} = {};

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
    ) {}

  ngOnInit(): void {
    this.getMovies();
    console.log('inital favoritesMap: ', this.favoritesMap);
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      console.log('initail favoritesMap when fetching movies: ', this.favoritesMap)
      return this.movies;
    });
  }

  getGenre(name: string, description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: name,
        content: description
      }
    })
  }

  getDirector(name: string, bio: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: name,
        content: bio
      }
    })
  }

  getDetails(description: string): void{
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: 'Description',
        content: description
      }
    })
  }

  addFavorite(id: string): void{
    if(this.favoritesMap[id]) {
      this.removeFavorite(id);
    } else {
      this.fetchApiData.addFavMovies(id).subscribe((response: any) => {
        this.favoritesMap[id] = true;
        console.log('favoritesMap after adding: ', this.favoritesMap);
        this.snackBar.open('added to favorites', 'OK', {
          duration: 2000
        })
      })
    }
   
  }

  isFavorite(id: string): boolean {
    return this.fetchApiData.isFavoriteMovie(id)
  }

  removeFavorite(id: string): void {
    this.fetchApiData.deleteFavMovies(id).subscribe((response: any) => {
      console.log('movie removed from favorites: ', id);
      console.log('favoritesMap before removal', this.favoritesMap);
      this.favoritesMap[id] = false;
      console.log('favoritesMap after removal: ', this.favoritesMap);

      if (localStorage.getItem('user') && localStorage.getItem('token')) {
      this.user = JSON.parse(localStorage.getItem('user')!)
      this.user.FavoriteMovies = this.user.FavoriteMovies.filter((movieId: string) => movieId !== id);
      }
      this.snackBar.open('removed from favorites', 'OK', {
        duration: 2000
      })
    })
  }

}
