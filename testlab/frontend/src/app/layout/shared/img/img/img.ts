import { Component } from '@angular/core';

@Component({
  selector: 'app-img',
  imports: [],
  templateUrl: './img.html',
  styleUrl: './img.css',
})
export class Img {

  readonly imgPath = 'img/';

  readonly noResults = [
    'no-results-1.webp',
    'no-results-2.webp',
    'no-results-3.webp',
  ];

  randomImgNoResults = this.imgPath + this.noResults[Math.floor(Math.random() * this.noResults.length)];
}
