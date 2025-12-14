import { Component, OnInit, input, OnChanges, SimpleChanges } from '@angular/core';
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
export class UsuarioDetail implements OnInit, OnChanges {

  usuarioId = input.required<string>();
  usuario!: UpdateUsuarioDto;
  form!: FormGroup;
  
  constructor(
    private _usuarioService: UsuarioService, private _route: ActivatedRoute,
    private _router: Router, private fb: FormBuilder
  ) {

    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]], // Nombre requerido
      email: ['', [Validators.required, Validators.email, Validators.minLength(3)]], // Email requerido con validación
      password: ['', [Validators.required, Validators.minLength(6)]], // Contraseña requerida con mínimo 6 caracteres
      rol: ['', Validators.required] // Rol requerido
    });
  }

  ngOnInit(): void {
    if (this.usuarioId() != '') {
      this.getUsuarioById(this.usuarioId());
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuarioId'] && !changes['usuarioId'].firstChange) {
      this.getUsuarioById(this.usuarioId());
    }
  }

  /*** Recuperación de Usuario ***/

  getUsuarioById(id: string): void {
    this._usuarioService.getUsuarioById(id).subscribe({
      next: 
        (usuario) => {
          this.usuario = usuario;

          // Inicializa el formulario con los valores del usuario recuperado
          this.form.setValue({
            nombre: this.usuario?.nombre,
            email: this.usuario?.email,
            password: this.usuario?.password,
            rol: this.usuario?.rol
          });

          // Comprueba la validez inicial de los datos traídos
          this.form.updateValueAndValidity();
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
    if (this.form.valid) {
      console.log('Formulario enviado!!', this.form.value);
      // TODO: Update con el servicio
    }
  }

  // Getter para acceder fácilmente a los controls del formulario
  get formControls() {
    console.log(this.form.invalid)
    return this.form.controls;
  }

}
