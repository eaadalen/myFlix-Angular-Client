import { Component, OnInit, Input, Inject } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  user: any = {};

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
  }

  updateUser(): void {
    
  }

  deleteUser(): void {
    if(confirm('Do you want to delete your account permanently?')) {
      this.router.navigate(['welcome']).then(() => {
        localStorage.clear();
        this.snackBar.open('Your account has been deleted', 'OK', {
          duration: 3000
        });
      })
      this.fetchApiData.deleteOneUser().subscribe((result) => {
        console.log(result);
      });
    }
  }

}
