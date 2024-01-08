import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.scss']
})
export class DirectorComponent implements OnInit{
  /**
   * This is the constructor for the component
   * @param data 
   * @returns director name, bio, birth_year, and death_year
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      name: string;
      bio: string;
      birth_year: string;
      death_year: string;
    }
  ) {}
  ngOnInit(): void {
      
  }
}