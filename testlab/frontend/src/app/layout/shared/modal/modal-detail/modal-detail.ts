import { Component, input } from '@angular/core';

@Component({
  selector: 'app-modal-detail',
  imports: [],
  templateUrl: './modal-detail.html',
  styleUrl: './modal-detail.css',
})
export class ModalDetail {
  title = input<string>();
}

