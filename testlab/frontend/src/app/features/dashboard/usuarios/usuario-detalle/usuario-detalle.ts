import { Component, OnInit } from '@angular/core';
import { UpdateUsuarioDto } from '../../../../models/usuario';
import { UsuarioService } from '../../../../services/usuario';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-usuario-detalle',
  imports: [ReactiveFormsModule],
  templateUrl: './usuario-detalle.html',
  styleUrl: './usuario-detalle.css',
  standalone: true
})
export class UsuarioDetalle {

  usuarioId: any;
  usuario: UpdateUsuarioDto|null = null;

  formUsuario: any;

  constructor(
    private _usuarioService: UsuarioService, private _route: ActivatedRoute,
    private _router: Router, private fb: FormBuilder
  ) {

    this._route.paramMap.subscribe((params: ParamMap) => {
      this.usuarioId = params.get('id');
      this.getUsuarioById(this.usuarioId);
    });

    this.formUsuario = this.fb.group({
      nombre: ['', Validators.required], // Nombre requerido
      email: ['', [Validators.required, Validators.email]], // Email requerido con validación
      password: ['', [Validators.required, Validators.minLength(6)]], // Contraseña requerida con mínimo 6 caracteres
      rol: ['', Validators.required] // Rol requerido
    });

    

    console.log('Formulario creado?');
  }

  /*** Recuperación de Usuario ***/

  getUsuarioById(id: string): void {
    this._usuarioService.getUsuarioById(id).subscribe({
      next: 
        (usuario) => {
          this.usuario = usuario;

          // Inicializa el formulario con los valores del usuario recuperado
          this.formUsuario.setValue({
            nombre: this.usuario?.nombre,
            email: this.usuario?.email,
            password: this.usuario?.password,
            rol: this.usuario?.rol
          });
        },
      error: (err) => {
        console.error('Error obteniendo el usuario:', err);
      }
    });
  }

  onSubmit() {
    if (this.formUsuario.valid) {
      console.log('Formulario enviado!!', this.formUsuario.value);
      // TODO: Update con el servicio
    }
  }

  // Getter para acceder fácilmente a los controls del formulario
  get formControls() {
    console.log(this.formUsuario.invalid)
    return this.formUsuario.controls;
  }

}
