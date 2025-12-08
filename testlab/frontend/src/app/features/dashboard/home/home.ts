import { Component } from '@angular/core';
import { Calendar } from '../../../layout/shared/calendar/calendar'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Calendar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
