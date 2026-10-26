import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl, FormBuilder, ReactiveFormsModule,
  ValidationErrors, Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  mostrarClave = signal(false);
  mensaje = signal('');

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
    // TODO: aquí se llamará a la API de FastAPI (POST /auth/registro)
    this.mensaje.set('Registro válido. Pronto se conectará con el servidor.');
  }
}