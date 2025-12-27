import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts = signal<{ text: string, type: 'success' | 'error' }[]>([]);

  show(text: string, type: 'success' | 'error' = 'success') {
    this.toasts.update(t => [...t, { text, type }]);

    setTimeout(() => {
      this.toasts.update(t => t.slice(1));
    }, 3000);
  }
}