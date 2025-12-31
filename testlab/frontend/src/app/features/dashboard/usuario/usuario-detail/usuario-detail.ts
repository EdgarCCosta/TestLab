import { Component, OnInit, OnChanges, SimpleChanges, input, model, output, effect } from '@angular/core';
import { UpdateUsuarioDto } from '../../../../models/usuario';
import { UsuarioService } from '../../../../services/usuario-service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-usuario-detail',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './usuario-detail.html',
  styleUrls: ['./usuario-detail.css']
})
export class UsuarioDetail {

  usuarioId = input<string | null>();                 // puede ser string o null
  modo = input<'nuevo' | 'detalle'>('detalle');       // valor por defecto: 'detalle'
  listado = model<any[]>([]);

  usuario!: UpdateUsuarioDto;
  form!: FormGroup;

  constructor(
    private _usuarioService: UsuarioService,
    private _route: ActivatedRoute,
    private _router: Router,
    private fb: FormBuilder
  ) {

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['', Validators.required]
    });

    effect(() => {
      if (this.usuarioId() != null) {
        console.log('Cambia el usuario');
        this.getUsuarioById(this.usuarioId()!);
      }

      if (this.listado().length) {
        console.log('Nuevo usuario añadido al listado:', this.listado);
      }

      if (this.modo() === 'nuevo') {
        this.form.reset({
          name: '',
          email: '',
          password: '',
          rol: ''
        });
      }
    });
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['usuarioId'] && !changes['usuarioId'].firstChange && this.modo() === 'detalle') {
  //     this.getUsuarioById(this.usuarioId()!);
  //   }
  //   if (changes['modo'] && this.modo() === 'nuevo') {
  //   this.form.reset({
  //     name: '',
  //     email: '',
  //     password: '',
  //     rol: ''
  //   });
  // }

  /*** Recuperación de Usuario ***/
  getUsuarioById(id: string): void {
    console.log('En propiedad getUsuarioById');
    this._usuarioService.getUsuarioById(id).subscribe({
      next: (datos) => {
        console.log(datos);
        this.usuario = datos.data;
        this.form.setValue({
          name: this.usuario?.name,
          email: this.usuario?.email,
          password: '',
          rol: this.usuario?.rol
        });
        this.form.updateValueAndValidity();
      },
      error: (err) => {
        console.error('Error obteniendo el usuario:', err);
      }
    });
  }

  borrar(id: string | null | undefined): void {
    if (!id) {
      console.warn('No hay usuarioId válido para borrar');
      return;
    }

    this._usuarioService.deleteUsuario(id).subscribe({
      next: data => {
        console.log("OK: ", data);
        this.volver();
      },
      error: error => {
        console.log("Error: ", error);
      }
    });
  }

  volver(): void {
    this._router.navigate(['usuario']);
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Formulario enviado!!', this.form.value);

      if (this.modo() === 'detalle' && this.usuarioId()) {
        this._usuarioService.updateUsuario(this.usuarioId()!, this.form.value).subscribe({
          next: () => console.log('Usuario actualizado'),
          error: (err) => console.error('Error actualizando usuario:', err)
        });
      } else if (this.modo() === 'nuevo') {
        this._usuarioService.createUsuario(this.form.value).subscribe({
          next: (datos) => {
            console.log('Usuario creado');
            // console.log('Listado antes de añadir:', this.listado());
            this.listado.update((listado) => ([...listado, datos.data]));
            // console.log('Listado tras añadir:', this.listado());
          },
          error: (err) => console.error('Error creando usuario:', err)
        });
      }

      const modalEl = document.getElementById('detalleModal');
      if (modalEl) {
        const modal = Modal.getInstance(modalEl);
        modal?.hide();
      }
    }
  }

  get formControls() {
    return this.form.controls;
  }
}