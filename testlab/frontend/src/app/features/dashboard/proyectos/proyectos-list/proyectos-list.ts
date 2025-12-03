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
  
    constructor(private proyectoService: ProyectoService) {}
  
    ngOnInit(): void {
      this.proyectoService.getProyectos().subscribe({
        next: (lista) => this.proyectos = lista
      });
    }
  
    getProyectos() {
      this.proyectoService.getProyectos().subscribe((proyectos) => {
        this.proyectos = proyectos;
      });
    }

}
