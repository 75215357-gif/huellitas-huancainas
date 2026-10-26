import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-iniciar-sesion',
  styleUrl: './iniciar-sesion.css',
  templateUrl: './iniciar-sesion.html',
})
export class IniciarSesion {
  private fb = inject(FormBuilder);

  mostrarClave = signal(false);
  mensaje = signal('');

  formulario = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required, Validators.minLength(8)]],
  });

  // Acceso corto a los controles desde el HTML
  get f() {
    return this.formulario.controls;
  }

  iniciarSesion() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    // TODO: aquí se llamará a la API de FastAPI (POST /auth/login)
    this.mensaje.set('Formulario válido. Pronto se conectará con el servidor.');
  }
}