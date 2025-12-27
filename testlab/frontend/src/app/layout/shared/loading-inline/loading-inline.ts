import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-inline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-inline.html',
  styleUrls: ['./loading-inline.css']
})
export class LoadingInlineComponent {
  @Input() show = false;
}