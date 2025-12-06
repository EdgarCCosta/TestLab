import { Component, OnInit } from '@angular/core';
import { Proyecto } from '../../../../models/proyecto';
import { ProyectoService } from '../../../../services/proyecto-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proyecto-list',
  imports: [CommonModule],
  templateUrl: './proyecto-list.html',
  styleUrl: './proyecto-list.css',
})
export class ProyectoList implements OnInit {

  proyectos: Proyecto[] = [];

  constructor(private _proyectoService: ProyectoService) {}

  ngOnInit(): void {
    this._proyectoService.getProyectos().subscribe({
      next: (lista) => this.proyectos = lista
    });
  }
}
