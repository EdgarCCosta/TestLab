import { Component, OnInit } from '@angular/core';
import { differenceInDays, isPast, isToday, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

import { Version } from '../../../models/version';
import { VersionService } from '../../../services/version-service';
import { ProyectoService } from '../../../services/proyecto-service';
import { LoadingInlineComponent } from '../../../layout/shared/loading-inline/loading-inline';

interface DiaCalendario {
  date: Date | null;
  versiones: Version[];
  isCurrentMonth: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, LoadingInlineComponent],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css'],
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

  private projectMap = new Map<string, string>();

  hoy = new Date();
  currentDate = new Date();

  monthName = '';
  monthText = '';
  weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  dias: DiaCalendario[] = [];
  semanas: DiaCalendario[][] = [];

  versiones: Version[] = [];
  selected: Version | null = null;
  nextVersion: Version | null = null;

  versionesMesActual = 0;
  versionesMesSiguiente = 0;
  loading = false;

  constructor(
    private versionService: VersionService,
    private proyectoService: ProyectoService
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.loading = true;

    // 1. Cargar proyectos
    this.proyectoService.getProyectos().subscribe({
      next: (pres) => {
        pres.forEach(p => this.projectMap.set(p.id, p.name));

        // 2. Cargar versiones
        this.versionService.getVersiones().subscribe({
          next: (vres) => {
            // 3. Enriquecer versiones con project_name
            this.versiones = vres.map((v: Version) => ({
              ...v,
              project_name: this.projectMap.get(v.project_id) ?? 'Proyecto desconocido'
            }));

            this.monthName = format(this.currentDate, 'MMMM yyyy', { locale: es });
            this.monthText = format(this.currentDate, 'MMMM', { locale: es });

            this.generarCalendario();
            this.computenextVersion();
            this.computeProjectCounts();
            this.loading = false
          },
          error: (err) => console.error('Error cargando versiones', err),
          // complete: () => this.loading = false
        });
        
      },
      error: (err) => console.error('Error cargando proyectos', err),
      // complete: () => this.loading = false
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
      temp.push({ date: null, versiones: [], isCurrentMonth: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const fecha = new Date(year, month, d);

      const asignados = this.versiones.filter(v => {
        const f = new Date(v.release_date);
        return f.getDate() === d && f.getMonth() === month && f.getFullYear() === year;
      });

      temp.push({ date: fecha, versiones: asignados, isCurrentMonth: true });
    }

    while (temp.length % 7 !== 0) {
      temp.push({ date: null, versiones: [], isCurrentMonth: false });
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

  seleccionarProyecto(v: Version) {
    if (this.selected?.id === v.id) {
      this.selected = null;
      return;
    }

    this.selected = null;
    setTimeout(() => {
      this.selected = v;
    });
  }

  diasRestantes(v: Version): number {
    return differenceInDays(new Date(v.release_date), new Date());
  }

  vencido(v: Version): boolean {
    const entrega = new Date(v.release_date);
    return isPast(entrega) && !isToday(entrega);
  }

  computenextVersion() {
    const hoy = new Date();
    const futuros: any[] = [];

    for (const d of this.dias) {
      if (d.date && d.versiones.length > 0 && d.date >= hoy) {
        d.versiones.forEach(v =>
          futuros.push({ ...v, fecha: d.date })
        );
      }
    }

    futuros.sort((a, b) => a.fecha - b.fecha);

    this.nextVersion = futuros.length > 0 ? futuros[0] : null;
  }

  computeProjectCounts() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const nextMonth = month + 1;
    const nextMonthYear = nextMonth > 11 ? year + 1 : year;
    const nextMonthIndex = nextMonth % 12;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    this.versionesMesActual = 0;
    this.versionesMesSiguiente = 0;

    for (const v of this.versiones) {
      const fecha = new Date(v.release_date);
      fecha.setHours(0, 0, 0, 0);

      if (fecha < hoy) continue;

      const m = fecha.getMonth();
      const y = fecha.getFullYear();

      if (m === month && y === year) {
        this.versionesMesActual++;
      }

      if (m === nextMonthIndex && y === nextMonthYear) {
        this.versionesMesSiguiente++;
      }
    }
  }
}