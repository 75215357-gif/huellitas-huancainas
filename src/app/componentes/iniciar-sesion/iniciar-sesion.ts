import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-iniciar-sesion',
  styleUrl: './iniciar-sesion.css',
  templateUrl: './iniciar-sesion.html',
})
export class IniciarSesion {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  mostrarClave = signal(false);
  mensaje = signal('');
  error = signal('');
  cargando = signal(false);

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

    this.cargando.set(true);
    this.mensaje.set('');
    this.error.set('');

    const { correo, clave } = this.formulario.getRawValue();

    this.authService.login(correo, clave).subscribe({
      next: (res) => {
        this.cargando.set(false);
        this.mensaje.set(`¡Bienvenido de nuevo, ${res.usuario.nombres}! Redirigiendo...`);
        setTimeout(() => {
          this.router.navigate(['/animales']);
        }, 1200);
      },
      error: (err) => {
        this.cargando.set(false);
        const detalle = err.error?.detail || 'Credenciales inválidas o error de conexión con el servidor.';
        this.error.set(detalle);
      }
    });
  }
}
