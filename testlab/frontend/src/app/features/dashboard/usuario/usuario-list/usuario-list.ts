import { Component, inject,  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../../models/usuario';
import { UsuarioService } from '../../../../services/usuario-service';
import { UsuarioDetail } from '../usuario-detail/usuario-detail';
import { ModalDetail } from '../../../../layout/shared/modal/modal-detail/modal-detail';
import { Listado } from '../../../../layout/shared/listado/listado';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService } from '../../../../layout/shared/toast/toast';
import { LoadingComponent } from '../../../../layout/shared/loading/loading';
import { SpinnerService } from '../../../../services/spinner-service';
import { signal, computed } from '@angular/core';
import { OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth-service';


@Component({
  selector: 'app-usuario-list',
  imports: [CommonModule, UsuarioDetail, Listado, FormsModule, LoadingComponent, ModalDetail],
  templateUrl: './usuario-list.html',
  standalone: true,
})
export class UsuarioList implements OnInit {
  // 1. Signals de estado base
  usuarios = signal<any[]>([]); 
  filtro = signal<string>(''); // Este sustituye a _filtro
  
  usuarioSelId: string | null = null;
  nuevoUser: boolean = false;
  loading: boolean = true;

  // 2. Signal Computada (Se actualiza SOLA cuando 'usuarios' o 'filtro' cambian)
  usuariosFiltrados = computed(() => {
    const term = this.filtro().toLowerCase();
    const lista = this.usuarios();
    
    if (!term) return lista;

    return lista.filter(u => 
      u.name.toLowerCase().includes(term) || 
      u.email.toLowerCase().includes(term) ||
      (u.rol && u.rol.toLowerCase().includes(term))
    );
  });

  auth = inject(AuthService);
  role = this.auth.role;

  constructor(
    private _usuarioService: UsuarioService, 
    private toastService: ToastService,
    public _spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.loading = true;
    this._usuarioService.getUsuarios().subscribe({
      next: (response) => {
        // IMPORTANTE: Usamos .set() para actualizar la Signal
        const dataMapeada = response.map(u => ({
          ...u,
          Nombre: u.name,
          Email: u.email,
          Rol: u.rol
        }));
        
        this.usuarios.set(dataMapeada); 
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastService.show('No se pudieron cargar los usuarios', 'error');
      }
    });
  }

  // Ya no necesitas 'listadoChange' ni el 'setter' de filtro
  // porque la signal 'usuariosFiltrados' reacciona al cambio de 'usuarios'
  
  seleccionarUsuario(id: string): void {
    this.usuarioSelId = id;
    this.nuevoUser = false;
  }

  abrirNuevoUsuario() {
    this.usuarioSelId = null;
    this.nuevoUser = true;
  }
}