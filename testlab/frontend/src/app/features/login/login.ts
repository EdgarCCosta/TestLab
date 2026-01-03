import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../layout/shared/loading/loading';
import { SpinnerService } from '../../services/spinner-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoadingComponent],
  templateUrl: './login.html'
})
export class Login {
  form!: FormGroup;
  error!: string;

  constructor(private fb: FormBuilder, private _auth: AuthService, private router: Router, public _spinnerService: SpinnerService) {

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email requerido
      password: ['', [Validators.required]], // Contraseña requerida, mayor que 6 caracteres
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      console.log(email, password);
      this._auth.login(email, password).subscribe({
        next: (response) => {
          console.log(response);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('id', response.data.user.id);
          localStorage.setItem('nombre', response.data.user.name);
          this.router.navigate(['/'])
        },
        error: () => this.error = 'Credenciales inválidas'
      });
    }
  }
}