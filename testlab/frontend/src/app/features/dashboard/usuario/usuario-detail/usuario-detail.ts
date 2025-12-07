import { Component } from '@angular/core';
import { UpdateUsuarioDto } from '../../../../models/usuario';
import { UsuarioService } from '../../../../services/usuario-service';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-usuario-detail',
  imports: [ReactiveFormsModule],
  templateUrl: './usuario-detail.html',
  styleUrl: './usuario-detail.css',
  standalone: true
})
export class UsuarioDetail {

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

  borrar(id: string): void {
    this._usuarioService.deleteUsuario(id).subscribe({
      next: data => {
        console.log("OK: ", data);
        //this._toastsService.mostrar('El usuario se ha eliminado correctamente.');
        this.volver();
      },
      error: error => {
        console.log("Error: ", error);
        //this._toastsService.mostrar('Ha habido un error al eliminar el usuario.');
      }
    });
  }

  volver(): void {
    this._router.navigate(['usuario']);
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
