import { Component, OnInit } from '@angular/core';
import { Proyecto } from '../../../../models/proyecto';
import { ProyectoService } from '../../../../services/proyecto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proyectos-list',
  imports: [CommonModule],
  templateUrl: './proyectos-list.html',
  styleUrl: './proyectos-list.css',
})
export class ProyectosList implements OnInit {

  proyectos: Proyecto[] = [];

  constructor(private _proyectoService: ProyectoService) {}

  ngOnInit(): void {
    this._proyectoService.getProyectos().subscribe({
      next: (lista) => this.proyectos = lista
    });
  }
}
