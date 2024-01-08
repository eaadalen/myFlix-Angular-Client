import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { MovieInfoComponent } from '../movie-info/movie-info.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})

export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favorites: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) {}
  
  ngOnInit(): void {
      this.getMovies();
      this.getFavorites();
  }

  getMovies(): void{
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies= resp;
      return this.movies;
    });
  }

 getFavorites(): void {
  this.fetchApiData.getOneUser().subscribe(
    (resp: any) => {
      if (resp.user && resp.user.favorite_movies) {
        this.favorites = resp.user.favorite_movies;
      } else {
        this.favorites = []; // Set an empty array if data is not available
      }
    },
    (error: any) => {
      console.error('Error fetching user data:', error);
      this.favorites = []; // Set an empty array on error as well
    }
  );
}


isFavoriteMovie(movieId: string): boolean {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.FavoriteMovies.indexOf(movieId) >= 0;
}

addToFavorites(movieId: string): void {
  if (this.isFavoriteMovie(movieId)) {
    this.removeFavoriteMovie(movieId);
  } else {
    this.fetchApiData.addfavoriteMovies(movieId).subscribe(() => {
      this.snackBar.open('Movie added to favorites', 'OK', {
        duration: 2000,
      });
      this.getFavorites();
    });
  }
}

removeFavoriteMovie(movieId: string): void {
  this.fetchApiData.deleteFavoriteMovie(movieId).subscribe(() => {
    this.snackBar.open('removed from favorites', 'OK', {
      duration: 2000
    })
  });
}

 openGenre(name: string, description: string): void {
  this.dialog.open(GenreComponent, {
    data: {
      name: name,
      description: description,
    },
    width: '400px',
  });
}

openDirector(name: string, bio: string, birth_year: string): void {
  this.dialog.open(DirectorComponent, {
    data: {
      name: name,
      bio: bio,
      birth_year: birth_year
    },
    width: '400px',
  });
}

openSynopsis(Title: String, Description: string): void {
  this.dialog.open(MovieInfoComponent, {
    data: {
      Title: Title,
      Description: Description,
    },
    width: '400px',
  });
}

}