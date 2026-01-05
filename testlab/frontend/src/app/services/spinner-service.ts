import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  private _loading = signal(false);

  loading = this._loading.asReadonly();

  show() {
      console.log('%cSHOW SPINNER', 'color: green; font-size: 16px');

    this._loading.set(true);
  }

  hide() {
    this._loading.set(false);
  }
}