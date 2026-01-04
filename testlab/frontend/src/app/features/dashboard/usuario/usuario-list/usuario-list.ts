import { Component,  } from '@angular/core';
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


@Component({
  selector: 'app-usuario-list',
  imports: [CommonModule, UsuarioDetail, Listado, FormsModule, LoadingComponent, ModalDetail],
  templateUrl: './usuario-list.html',
  standalone: true,
})
export class UsuarioList {

  public usuarios: any[] = [];
  public usuarioSelId: string | null = null;
  public usuariosFiltrados: Usuario[] = [];
  public nuevoUser: boolean = false;
  public _filtro: string = '';
  public loading: boolean = true;
  // public loading: boolean = false;

  constructor(
    private _usuarioService: UsuarioService, private _router: Router, private toastService: ToastService,
    public _spinnerService: SpinnerService
  ) {
  }
  ngOnInit() {
    this.obtenerUsuarios();   // En el constructor no se activan los interceptors
  }


  obtenerUsuarios(): void {
    this.loading = true; // ACTIVAR LOADING
    // this._spinnerService.show();

    this._usuarioService.getUsuarios().subscribe({
      next: (response) => {
        console.log('Response:', response);

          this.usuarios = response.map(u => {
            return {
              ...u,
              Nombre: u.name,
              Email: u.email,
              Rol: u.rol
            };
          });

          console.log('usuarios:', this.usuarios);
          
        this.usuariosFiltrados = this.usuarios;
        console.log("Tenemos los usuarios: ", this.usuarios);
        this.loading = false;

        // this.loading = false; // 👇 DESACTIVAR LOADING

        // // reaplicar filtro si existía
        // if (this._filtro !== '') {
        //   this.filtro = this._filtro;
        // }
      },
      error: () => {
        this.loading = false;
        this.toastService.show('No se pudieron cargar los usuarios', 'error');
        // ❌ No desactivas spinner aquí, lo hace el interceptor
      }
    });

    // 👇 Enganchar evento de Bootstrap para resetear al cerrar modal
    const modalEl = document.getElementById('detalleModal');
    if (modalEl) {
      modalEl.addEventListener('hidden.bs.modal', () => {
        this.usuarioSelId = null; // reset automático
        this.nuevoUser = false;
      });
    }

  }

  seleccionarUsuario(id: string): void {
    this.loading = false;
    this.usuarioSelId = id;
  }

  set filtro(valor: string) {
    this._filtro = valor;
    this.usuariosFiltrados = [];
    for (const u of this.usuarios) {
      if (
        u.name.toLowerCase().includes(valor.toLowerCase()) ||
        u.email.toLowerCase().includes(valor.toLowerCase()) ||
        u.rol.toLowerCase().includes(valor.toLowerCase())
      ) {
        this.usuariosFiltrados.push(u);
      }
    }
  }

  abrirNuevoUsuario() {
    this.loading = false;
    this.usuarioSelId = null;   // no hay id
    this.nuevoUser = true;      // activar modo creación
  }


  listadoChange($e: any) {
    console.log('Listado ha cambiado:', this.usuarios);
    this.usuariosFiltrados = [];
    for (const u of this.usuarios) {
      if (this._filtro !== '') {
        console.log("El filtro es:", this._filtro);
        if (
          u.name.toLowerCase().includes(this._filtro.toLowerCase()) ||
          u.email.toLowerCase().includes(this._filtro.toLowerCase()) ||
          u.rol.toLowerCase().includes(this._filtro.toLowerCase())
        ) {
          this.usuariosFiltrados.push(u);
        }
      } else {
          this.usuariosFiltrados.push(u);
      }
    }
  }
}
