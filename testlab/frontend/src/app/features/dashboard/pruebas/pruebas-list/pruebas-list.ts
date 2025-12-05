import { Component, OnInit } from '@angular/core';
import { Prueba } from '../../../../models/prueba';
import { PruebaService } from '../../../../services/prueba';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pruebas-list',
  imports: [CommonModule],
  templateUrl: './pruebas-list.html',
  styleUrls: ['./pruebas-list.css'],
})
export class PruebasList implements OnInit {
  pruebas: Prueba[] = [];

  constructor(private _pruebaService: PruebaService) {}

  ngOnInit(): void {
    this._pruebaService.getPruebas().subscribe({
      next: (lista) => (this.pruebas = lista),
    });
  }
}