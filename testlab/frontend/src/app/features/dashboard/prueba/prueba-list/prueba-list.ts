import { Component, OnInit } from '@angular/core';
import { Prueba } from '../../../../models/prueba';
import { PruebaService } from '../../../../services/prueba-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prueba-list',
  imports: [CommonModule],
  templateUrl: './prueba-list.html',
  styleUrls: ['./prueba-list.css'],
})
export class PruebaList implements OnInit {
  pruebas: Prueba[] = [];

  constructor(private _pruebaService: PruebaService) {}

  ngOnInit(): void {
    this._pruebaService.getPruebas().subscribe({
      next: (lista) => (this.pruebas = lista),
    });
  }
}