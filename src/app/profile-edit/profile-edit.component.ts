import { Component, OnInit, Input, Inject } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: ''};

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
    public dialogRef: MatDialog
  ) {}

  ngOnInit(): void {
  }

  updateUser(): void {
    let userDetails = {
      Username : this.userData.Username,
      Password : this.userData.Password,
      Email : this.userData.Email,
      Birthday : this.userData.Birthday
    }
    this.fetchApiData.editUser(userDetails).subscribe((result) => {
      console.log(result);
      this.dialogRef.closeAll();
      this.snackBar.open('Profile has been updated', 'OK', {
        duration: 3000
      });
    });
  }

  deleteUser(): void {
    if(confirm('Do you want to delete your account permanently?')) {
      this.dialogRef.closeAll();
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open('Your account has been deleted', 'OK', {
          duration: 3000
        });
      })
      this.fetchApiData.deleteOneUser().subscribe((result) => {
        console.log(result);
      });
      localStorage.clear();
    }
  }

}
