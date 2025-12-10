import { Component, OnInit } from '@angular/core';
import { differenceInDays, isPast, isToday, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

interface Proyecto {
  id: number;
  nombre: string;
  descripcion: string;
  usuario_id: number;
  fecha_entrega: string;
}

interface DiaCalendario {
  date: Date | null;
  proyectos: Proyecto[];
  isCurrentMonth: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css'],

  

  // 🔥 ANIMACIONES
  animations: [
    trigger('detalleAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(40px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('0ms ease-in', style({ opacity: 0, transform: 'translateX(40px)' }))
      ])
    ]),
      // Animación para noSel (entra por la izquierda)
  trigger('noSelAnim', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(-40px)' }),
      animate('250ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
    ]),
    transition(':leave', [
      animate('0ms ease-in', style({ opacity: 0, transform: 'translateX(-40px)' }))
    ])
  ])
  ]
})
export class Calendar implements OnInit {
  hoy = new Date();
  currentDate = new Date();

  monthName = '';
  monthText = '';
  weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  dias: DiaCalendario[] = [];
  semanas: DiaCalendario[][] = [];

  proyectos: Proyecto[] = [];
  selected: Proyecto | null = null;
  loading = true;

  nextProject: Proyecto | null = null;
  proyectosMesActual = 0;
  proyectosMesSiguiente = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.loading = true;

    this.http.get<Proyecto[]>('/api/proyecto')
      .subscribe({
        next: (res) => {
          this.proyectos = res;
          this.monthName = format(this.currentDate, 'MMMM yyyy', { locale: es });
          this.monthText = format(this.currentDate, 'MMMM', { locale: es });
          this.generarCalendario();
          this.computeNextProject();
          this.computeProjectCounts(); 
        },
        error: (err) => console.error('Error cargando proyectos', err),
        complete: () => this.loading = false
      });
  }

  generarCalendario() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const daysInMonth = lastDay.getDate();

    const temp: DiaCalendario[] = [];

    for (let i = 0; i < startOffset; i++) {
      temp.push({ date: null, proyectos: [], isCurrentMonth: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const fecha = new Date(year, month, d);
      const asignados = this.proyectos.filter((p) => {
        const f = new Date(p.fecha_entrega);
        return f.getDate() === d && f.getMonth() === month && f.getFullYear() === year;
      });

      temp.push({ date: fecha, proyectos: asignados, isCurrentMonth: true });
    }

    while (temp.length % 7 !== 0) {
      temp.push({ date: null, proyectos: [], isCurrentMonth: false });
    }

    this.dias = temp;

    this.semanas = [];
    for (let i = 0; i < temp.length; i += 7) {
      this.semanas.push(temp.slice(i, i + 7));
    }
  }

  cambiarMes(offset: number) {
    const y = this.currentDate.getFullYear();
    const m = this.currentDate.getMonth();
    this.currentDate = new Date(y, m + offset, 1);
    this.refresh();
  }

  seleccionarProyecto(p: Proyecto) {
    // Si es el mismo → cerrar
    if (this.selected?.id === p.id) {
      this.selected = null;
      return;
    }

    // Si es diferente → forzar animación doble:
    this.selected = null;          // Fuerza :leave
    setTimeout(() => {
      this.selected = p;           // Fuerza :enter
    });
  }


  diasRestantes(p: Proyecto): number {
    return differenceInDays(new Date(p.fecha_entrega), new Date());
  }

  vencido(p: Proyecto): boolean {
    const entrega = new Date(p.fecha_entrega);
    return isPast(entrega) && !isToday(entrega);
  }

  computeNextProject() {
    const hoy = new Date();
    const futuros: any[] = [];

    for (const d of this.dias) {
      if (d.date && d.proyectos.length > 0 && d.date >= hoy) {
        d.proyectos.forEach(p =>
          futuros.push({ ...p, fecha: d.date })
        );
      }
    }

    futuros.sort((a, b) => a.fecha - b.fecha);

    this.nextProject = futuros.length > 0 ? futuros[0] : null;
  }

computeProjectCounts() {
  const year = this.currentDate.getFullYear();
  const month = this.currentDate.getMonth();

  const nextMonth = month + 1;
  const nextMonthYear = nextMonth > 11 ? year + 1 : year;
  const nextMonthIndex = nextMonth % 12;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  this.proyectosMesActual = 0;
  this.proyectosMesSiguiente = 0;

  for (const p of this.proyectos) {
    const fecha = new Date(p.fecha_entrega);
    fecha.setHours(0, 0, 0, 0);

    // ❌ Proyecto vencido → NO contar
    if (fecha < hoy) continue;

    const m = fecha.getMonth();
    const y = fecha.getFullYear();

    // ✔ Pendientes del mes actual
    if (m === month && y === year) {
      this.proyectosMesActual++;
    }

    // ✔ Pendientes del mes siguiente
    if (m === nextMonthIndex && y === nextMonthYear) {
      this.proyectosMesSiguiente++;
    }
  }
}


}
