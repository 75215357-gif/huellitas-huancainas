import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, FormRoot, form, required, minLength, pattern } from '@angular/forms/signals';
import { DenunciaService } from '../../servicios/denuncia.service';
import { Denuncia } from '../../modelos/denuncia';

@Component({
  selector: 'app-denuncias',
  standalone: true,
  imports: [CommonModule, FormRoot, FormField],
  templateUrl: './denuncias.html',
  styleUrl: './denuncias.css'
})
export class Denuncias implements OnInit {
  private denunciaService = inject(DenunciaService);

  denuncias = signal<Denuncia[]>([]);
  cargandoListado = signal(true);
  enviando = signal(false);
  mensajeExito = signal('');
  errorEnvio = signal('');

  modelo = signal({
    titulo: '',
    ubicacion: '',
    contacto: '',
    descripcion: ''
  });

  readonly denunciaForm = form(
    this.modelo,
    (d) => {
      required(d.titulo, { message: 'El título del caso es obligatorio.' });
      minLength(d.titulo, 5, { message: 'Ingresa un título descriptivo (mínimo 5 caracteres).' });

      required(d.ubicacion, { message: 'La ubicación exacta es obligatoria.' });
      minLength(d.ubicacion, 5, { message: 'La ubicación debe tener al menos 5 caracteres.' });

      pattern(d.contacto, /^$|^[0-9]{9}$/, { message: 'Debe ser un número celular peruano válido de 9 dígitos.' });

      required(d.descripcion, { message: 'La descripción es obligatoria.' });
      minLength(d.descripcion, 15, { message: 'Por favor detalla la situación (mínimo 15 caracteres).' });
    },
    {
      submission: {
        action: async () => {
          this.registrarDenuncia();
        }
      }
    }
  );

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
    this.enviando.set(true);
    this.mensajeExito.set('');
    this.errorEnvio.set('');

    const val = this.modelo();

    this.denunciaService.crearDenuncia({
      titulo: val.titulo,
      ubicacion: val.ubicacion,
      contacto: val.contacto || undefined,
      descripcion: val.descripcion
    }).subscribe({
      next: (nueva) => {
        this.enviando.set(false);
        this.mensajeExito.set('¡Tu denuncia o caso de rescate ha sido registrado exitosamente! La red de rescatistas de Huancayo lo revisará a la brevedad.');
        this.modelo.set({
          titulo: '',
          ubicacion: '',
          contacto: '',
          descripcion: ''
        });
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
