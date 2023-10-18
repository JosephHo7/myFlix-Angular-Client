import { Component, OnInit, Input } from '@angular/core';

//use this to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

//import API calls
import { FetchApiDataService } from '../fetch-api-data.service';

//display notifications back to user
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: ''};

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
  }

  // This is the function responsible for sending the form inputs to the backend
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe((result) => {
       // Logic for a successful user registration goes here! (To be implemented)
       this.dialogRef.close();//this will close the modal on success
       console.log(result);
       this.snackBar.open('User Registration Successful', 'OK', {
        duration: 2000
       })
    }, (result) => {
      this.snackBar.open('Sorry, something went wrong','OK', {
        duration: 2000
      })
    })  
  }
}
