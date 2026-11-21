import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormField, FormRoot, form, required, minLength, maxLength, pattern, email, validate } from '@angular/forms/signals';
import { AuthService } from '../../servicios/auth.service';

@Component({
  imports: [FormRoot, FormField, RouterLink],
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro {
  private authService = inject(AuthService);
  private router = inject(Router);

  mostrarClave = signal(false);
  mensaje = signal('');
  error = signal('');
  cargando = signal(false);

  modelo = signal({
    nombres: '',
    dni: '',
    telefono: '',
    correo: '',
    rol: 'adoptante',
    clave: '',
    confirmarClave: '',
    aceptaTerminos: false,
  });

  readonly registroForm = form(
    this.modelo,
    (r) => {
      required(r.nombres, { message: 'Ingresa tu nombre completo (mínimo 3 letras).' });
      minLength(r.nombres, 3, { message: 'El nombre debe tener al menos 3 letras.' });

      required(r.dni, { message: 'El DNI es obligatorio.' });
      pattern(r.dni, /^\d{8}$/, { message: 'El DNI debe tener 8 dígitos.' });
      maxLength(r.dni, 8, { message: 'El DNI no puede exceder 8 dígitos.' });

      required(r.telefono, { message: 'El celular es obligatorio.' });
      pattern(r.telefono, /^9\d{8}$/, { message: 'Ingresa un celular de 9 dígitos que empiece con 9.' });
      maxLength(r.telefono, 9, { message: 'El celular debe tener 9 dígitos.' });

      required(r.correo, { message: 'El correo electrónico es obligatorio.' });
      email(r.correo, { message: 'Ingresa un correo electrónico válido.' });

      required(r.rol, { message: 'Selecciona cómo deseas participar.' });

      required(r.clave, { message: 'La contraseña es obligatoria.' });
      minLength(r.clave, 8, { message: 'Mínimo 8 caracteres.' });

      required(r.confirmarClave, { message: 'Confirma tu contraseña.' });
      validate(r.confirmarClave, ({ value }) => {
        const confirmacion = value();
        const claveOriginal = this.modelo().clave;
        if (confirmacion && claveOriginal && confirmacion !== claveOriginal) {
          return { kind: 'clavesDiferentes', message: 'Las contraseñas no coinciden.' };
        }
        return undefined;
      });

      required(r.aceptaTerminos, { message: 'Debes aceptar el compromiso para continuar.' });
    },
    {
      submission: {
        action: async () => {
          this.registrar();
        },
      },
    }
  );

  registrar() {
    this.cargando.set(true);
    this.mensaje.set('');
    this.error.set('');

    const val = this.modelo();

    this.authService.registro({
      dni: val.dni,
      nombres: val.nombres,
      telefono: val.telefono,
      correo: val.correo,
      rol: val.rol,
      clave: val.clave
    }).subscribe({
      next: (res) => {
        this.cargando.set(false);
        this.mensaje.set(`¡Cuenta creada exitosamente para ${res.usuario.nombres}! Redirigiendo...`);
        setTimeout(() => {
          this.router.navigate(['/animales']);
        }, 1200);
      },
      error: (err) => {
        this.cargando.set(false);
        const detalle = err.error?.detail || 'Error al crear la cuenta. Verifica que los datos no estén registrados.';
        this.error.set(detalle);
      }
    });
  }
}
