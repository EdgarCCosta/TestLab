import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html'
})
export class Login {
  form!: FormGroup;
  error!: string;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email requerido
      password: ['', [Validators.required]], // Contraseña requerida, mayor que 6 caracteres
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      console.log(email, password);
      this.auth.login(email, password).subscribe({
        next: (response) => {
          console.log(response);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('usuario', JSON.stringify(response.data.user.email));
          this.router.navigate(['/'])
        },
        error: () => this.error = 'Credenciales inválidas'
      });
    }
  }
}