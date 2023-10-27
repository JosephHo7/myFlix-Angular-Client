import { Component} from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {  
    constructor(
      public fetchApiData: FetchApiDataService,
      public router: Router
    ) {}

    ngOnInit(): void {}

    toMovies(): void {
      this.router.navigate(['movies']);
    }

    toProfile(): void{
      this.router.navigate(['profile']);
    }
}
