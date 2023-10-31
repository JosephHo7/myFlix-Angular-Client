import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [DatePipe]
})
export class UserProfileComponent implements OnInit {
  user: any = {};

  FavoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('user') && localStorage.getItem('token')) {
      this.user = JSON.parse(localStorage.getItem('user')!)
      console.log(this.user)
      this.fetchFavoriteMovies()
    } else {
      this.router.navigate(['welcome'])
    }
  }

  fetchFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      const movies = resp
      movies.forEach((movie: any) => {
        if (this.user.FavoriteMovies.includes(movie._id)) {
          this.FavoriteMovies.push(movie)
        }
      })
    })
  }

  editUser(): void {
    this.fetchApiData.editUser(this.user).subscribe((data) => {
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('Username', data.Username);
      console.log(data);
      this.snackBar.open('User has been updated', 'OK', {duration: 2000})
      window.location.reload();
    }, (result) => {
      this.snackBar.open(result, 'OK', {duration: 2000})
    })
  }
  
  deleteUser(): void {
    if (confirm('are you sure?')){
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open('User Deleted', 'OK', {duration: 2000})
      })
      this.fetchApiData.deleteUser().subscribe((result) => {
        console.log(result);
        localStorage.clear();
      })
    }
  }
}

