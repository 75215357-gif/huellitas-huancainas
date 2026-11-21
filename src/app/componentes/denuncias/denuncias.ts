import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DenunciaService } from '../../servicios/denuncia.service';
import { Denuncia } from '../../modelos/denuncia';

@Component({
  selector: 'app-denuncias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './denuncias.html',
  styleUrl: './denuncias.css'
})
export class Denuncias implements OnInit {
  private fb = inject(FormBuilder);
  private denunciaService = inject(DenunciaService);

  denuncias = signal<Denuncia[]>([]);
  cargandoListado = signal(true);
  enviando = signal(false);
  mensajeExito = signal('');
  errorEnvio = signal('');

  formulario = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(5)]],
    ubicacion: ['', [Validators.required, Validators.minLength(5)]],
    contacto: ['', [Validators.pattern('^[0-9]{9}$')]],
    descripcion: ['', [Validators.required, Validators.minLength(15)]]
  });

  ngOnInit(): void {
    this.cargarDenuncias();
  }

  cargarDenuncias(): void {
    this.cargandoListado.set(true);
    this.denunciaService.getDenuncias().subscribe({
      next: (data) => {
        this.denuncias.set(data);
        this.cargandoListado.set(false);
      },
      error: () => {
        this.cargandoListado.set(false);
      }
    });
  }

  registrarDenuncia(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.mensajeExito.set('');
    this.errorEnvio.set('');

    const val = this.formulario.value;

    this.denunciaService.crearDenuncia({
      titulo: val.titulo || '',
      ubicacion: val.ubicacion || '',
      contacto: val.contacto || undefined,
      descripcion: val.descripcion || ''
    }).subscribe({
      next: (nueva) => {
        this.enviando.set(false);
        this.mensajeExito.set('¡Tu denuncia o caso de rescate ha sido registrado exitosamente! La red de rescatistas de Huancayo lo revisará a la brevedad.');
        this.formulario.reset();
        // Agregar la nueva denuncia a la lista
        this.denuncias.update((prev) => [nueva, ...prev]);
      },
      error: (err) => {
        this.enviando.set(false);
        const detalle = err.error?.detail || 'No se pudo enviar la denuncia. Intente de nuevo.';
        this.errorEnvio.set(detalle);
      }
    });
  }
}
