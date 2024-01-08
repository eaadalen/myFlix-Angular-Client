import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.scss']
})
export class MovieInfoComponent implements OnInit{
  /**
   * This is the constructor for the component
   * @param data 
   * @returns Title and Description
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data:{
      Title: string;
      Description: string
    }
  ) {}

  ngOnInit(): void {
      
  }
}