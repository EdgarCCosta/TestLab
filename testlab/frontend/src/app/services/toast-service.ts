import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  public toasts: Array<string> = [];

  mostrar(mensaje: string) {
      this.toasts.push(mensaje);
      console.log("Toasts: ", this.toasts);
  }

  eliminar(toast: any) {
      this.toasts = this.toasts.filter(t => t !== toast);
      console.log("Toasts: ", this.toasts);
  }

  vaciar() {
      this.toasts.splice(0, this.toasts.length);
  }
  
}