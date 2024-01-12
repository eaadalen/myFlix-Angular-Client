import { Component, OnInit, Input, Inject } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { ProfileEditComponent } from '../profile-edit/profile-edit.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit{
  user: any = {};
  favorites: any[] = [];

  @Input() userData = { username: '', password: '', email: '', birth_date: '',}

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      name: string;
      email: string;
      birthday: string;
    },
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
    public dialog : MatDialog,
  ) {}

  ngOnInit(): void {
    this.defineUser();
  }

  defineUser(): void{
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = user;
    for (let i = 0; i < user.FavoriteMovies.length; i++) {
      this.fetchApiData.getOneMovie(user.FavoriteMovies[i]).subscribe((result) => {
        this.favorites.push(result);
      });
    }
  }
 
  // logic for edit user profile
  editProfile() : void{
    this.dialog.open(ProfileEditComponent, {width: '400px',});
  }
   
  }
