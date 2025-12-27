import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../toast';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html'
})
export class ToastsComponent {
  constructor(public toastService: ToastService) {}
}