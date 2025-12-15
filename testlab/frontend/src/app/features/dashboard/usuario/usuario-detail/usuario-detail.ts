import { Component, OnInit, OnChanges, SimpleChanges, input } from '@angular/core';
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
export class UsuarioDetail implements OnInit, OnChanges {

  usuarioId = input<string | null>();                 // puede ser string o null
  modo = input<'nuevo' | 'detalle'>('detalle');       // valor por defecto: 'detalle'

  usuario!: UpdateUsuarioDto;
  form!: FormGroup;

  constructor(
    private _usuarioService: UsuarioService,
    private _route: ActivatedRoute,
    private _router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log("modo: " + this.modo());
    if (this.modo() === 'detalle' && this.usuarioId()) {
      this.getUsuarioById(this.usuarioId()!);
    } else if (this.modo() === 'nuevo') {
    // Caso nuevo → resetear el formulario en blanco
    this.form.reset({
      nombre: '',
      email: '',
      password: '',
      rol: ''
    });
  }

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuarioId'] && !changes['usuarioId'].firstChange && this.modo() === 'detalle') {
      this.getUsuarioById(this.usuarioId()!);
    }
    if (changes['modo'] && this.modo() === 'nuevo') {
    this.form.reset({
      nombre: '',
      email: '',
      password: '',
      rol: ''
    });
  }

  }

  /*** Recuperación de Usuario ***/
  getUsuarioById(id: string): void {
    this._usuarioService.getUsuarioById(id).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.form.setValue({
          nombre: this.usuario?.nombre,
          email: this.usuario?.email,
          password: this.usuario?.password,
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
          next: () => console.log('Usuario creado'),
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