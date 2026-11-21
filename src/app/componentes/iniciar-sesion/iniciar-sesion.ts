import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormField, FormRoot, form, required, minLength, email } from '@angular/forms/signals';
import { AuthService } from '../../servicios/auth.service';

@Component({
  imports: [FormRoot, FormField, RouterLink],
  selector: 'app-iniciar-sesion',
  styleUrl: './iniciar-sesion.css',
  templateUrl: './iniciar-sesion.html',
})
export class IniciarSesion {
  private authService = inject(AuthService);
  private router = inject(Router);

  mostrarClave = signal(false);
  mensaje = signal('');
  error = signal('');
  cargando = signal(false);

  modelo = signal({
    correo: '',
    clave: '',
  });

  readonly loginForm = form(
    this.modelo,
    (f) => {
      required(f.correo, { message: 'El correo es obligatorio.' });
      email(f.correo, { message: 'Ingresa un correo válido.' });

      required(f.clave, { message: 'La contraseña es obligatoria.' });
      minLength(f.clave, 8, { message: 'Mínimo 8 caracteres.' });
    },
    {
      submission: {
        action: async () => {
          this.iniciarSesion();
        },
      },
    }
  );

  iniciarSesion() {
    this.cargando.set(true);
    this.mensaje.set('');
    this.error.set('');

    const { correo, clave } = this.modelo();

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
