import { Component, OnInit } from '@angular/core';
import { differenceInDays, isPast, isToday, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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
})
export class Calendar implements OnInit {
  hoy = new Date();
  currentDate = new Date();

  monthName = '';
  weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  dias: DiaCalendario[] = [];
  semanas: DiaCalendario[][] = [];

  proyectos: Proyecto[] = [];
  selected: Proyecto | null = null;
  loading = true;

  // 👇 IMPORTANTE: añadir propiedad
  nextProject: Proyecto | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.loading = true;

    this.http.get<Proyecto[]>('http://localhost:4200/proyecto')
      .subscribe({
        next: (res) => {
          this.proyectos = res;
          this.monthName = format(this.currentDate, 'MMMM yyyy', { locale: es });
          this.generarCalendario();
          this.computeNextProject();   // 👈 AÑADIDO
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

    // días previos
    for (let i = 0; i < startOffset; i++) {
      temp.push({ date: null, proyectos: [], isCurrentMonth: false });
    }

    // días del mes
    for (let d = 1; d <= daysInMonth; d++) {
      const fecha = new Date(year, month, d);
      const asignados = this.proyectos.filter((p) => {
        const f = new Date(p.fecha_entrega);
        return f.getDate() === d && f.getMonth() === month && f.getFullYear() === year;
      });

      temp.push({ date: fecha, proyectos: asignados, isCurrentMonth: true });
    }

    // completar al múltiplo de 7
    while (temp.length % 7 !== 0) {
      temp.push({ date: null, proyectos: [], isCurrentMonth: false });
    }

    this.dias = temp;

    // semanas
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
    if (this.selected && this.selected.id === p.id) {
      this.selected = null;   // 👈 deseleccionar si vuelves a pulsar
    } else {
      this.selected = p;      // 👈 seleccionar normalmente
    }
  }


  diasRestantes(p: Proyecto): number {
    const hoy = new Date();
    const entrega = new Date(p.fecha_entrega);
    return differenceInDays(entrega, hoy);
  }

  vencido(p: Proyecto): boolean {
    const entrega = new Date(p.fecha_entrega);
    return isPast(entrega) && !isToday(entrega);
  }

  // ✔ Próximo proyecto por vencer
  computeNextProject() {
    const hoy = new Date();
    const futuros: any[] = [];

    for (const d of this.dias) {
      if (d.date && d.proyectos.length > 0 && d.date >= hoy) {
        d.proyectos.forEach(p => {
          futuros.push({
            ...p,
            fecha: d.date
          });
        });
      }
    }

    futuros.sort((a, b) => a.fecha - b.fecha);

    this.nextProject = futuros.length > 0 ? futuros[0] : null;
  }
}
