import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl, FormBuilder, ReactiveFormsModule,
  ValidationErrors, Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

// Valida que las dos contraseñas sean iguales
function clavesIguales(grupo: AbstractControl): ValidationErrors | null {
  const clave = grupo.get('clave')?.value;
  const confirmar = grupo.get('confirmarClave')?.value;
  return clave === confirmar ? null : { clavesDiferentes: true };
}

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  mostrarClave = signal(false);
  mensaje = signal('');
  error = signal('');
  cargando = signal(false);

  formulario = this.fb.nonNullable.group(
    {
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      rol: ['adoptante', Validators.required],
      clave: ['', [Validators.required, Validators.minLength(8)]],
      confirmarClave: ['', Validators.required],
      aceptaTerminos: [false, Validators.requiredTrue],
    },
    { validators: clavesIguales }
  );

  get f() {
    return this.formulario.controls;
  }

  registrar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.mensaje.set('');
    this.error.set('');

    const val = this.formulario.getRawValue();

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
