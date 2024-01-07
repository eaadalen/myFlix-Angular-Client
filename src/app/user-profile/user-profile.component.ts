import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent {
  user: any[] = [];
  constructor(public fetchApiData: FetchApiDataService) { }

ngOnInit(): void {
}

getUser(): void {
  this.fetchApiData.getOneUser().subscribe((resp: any) => {
      this.user = resp;
      const userID = JSON.parse(localStorage.getItem('user') || '{}')
      let profile;

      for (const prop in this.user) {
        console.log(String(userID.Username) + "   " + String(this.user[prop].Username));
        if (this.user[prop].Username == userID) {
          console.log("true");
          profile = this.user[prop];
        }
      }

      return this.user;
    });
  }
}