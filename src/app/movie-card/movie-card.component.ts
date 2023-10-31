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
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
    ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
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
    this.fetchApiData.addFavMovies(id).subscribe((response: any) => {
      this.snackBar.open('added to favorites', 'OK', {
        duration: 2000
      })
    })
  }

  isFavorite(id: string): boolean {
    return this.fetchApiData.isFavoriteMovie(id)
  }

  removeFavorite(id: string): void {
    this.fetchApiData.deleteFavMovies(id).subscribe((response: any) => {
      this.snackBar.open('removed from favorites', 'OK', {
        duration: 2000
      })
    })
  }

}
