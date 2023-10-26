import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

//use this to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

//import API calls
import { FetchApiDataService } from '../fetch-api-data.service';

//display notifications back to user
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {

  @Input() userData = { Username: '', Password: ''};

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  // This is the function responsible for sending the form inputs to the backend
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe((result) => {
       // Logic for a successful user login goes here! (To be implemented)
       console.log(result);
       localStorage.setItem('user', JSON.stringify(result.user));
       localStorage.setItem('token', result.token);
       this.dialogRef.close();//this will close the modal on success
       this.snackBar.open('User Login Successful', 'OK', {
        duration: 2000
       })
       this.router.navigate(['movies']);
    }, (result) => {
      this.snackBar.open('Sorry, something went wrong','OK', {
        duration: 2000
      })
    })  
  }
}
