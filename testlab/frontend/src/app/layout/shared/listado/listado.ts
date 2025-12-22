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
  itemSelId = model<string | null>();

  constructor() {
    effect(() => {
      // console.log('Cabeceras: ', this.cabeceras());
      // console.log('Datos: ', this.datos());
      // console.log('Atributos: ', this.atributos());
    });
  }

  seleccionarItem(id: any) {
    console.log('Seleccionado: ', id);
    this.itemSelId.update(() => id);
  }

resetSeleccion() {
  this.itemSelId.set(null); // vuelve a estado vacío
}

}
