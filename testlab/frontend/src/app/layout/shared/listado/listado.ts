import { Component, input, effect, model } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listado',
  imports: [CommonModule],
  templateUrl: './listado.html',
  styleUrl: './listado.css',
  standalone: true,
})

export class Listado {
  cabeceras = input<string[]>();
  datos = input<any[]>();
  atributos = input<string[]>();
  itemSelId = model<string>();

  constructor() {
    effect(() => {
      // console.log('Cabeceras: ', this.cabeceras());
      // console.log('Datos: ', this.datos());
      // console.log('Atributos: ', this.atributos());
    });
  }

  seleccionarItem(id: any) {
    this.itemSelId.update(() => id);
  }
}
