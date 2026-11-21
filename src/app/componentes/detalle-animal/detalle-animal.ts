import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnimalService } from '../../servicios/animal.service';
import { AuthService } from '../../servicios/auth.service';
import { SolicitudService } from '../../servicios/solicitud.service';
import { Animal } from '../../modelos/animal';

@Component({
  selector: 'app-detalle-animal',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './detalle-animal.html',
  styleUrl: './detalle-animal.css'
})
export class DetalleAnimal implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private animalService = inject(AnimalService);
  protected authService = inject(AuthService);
  private solicitudService = inject(SolicitudService);

  animal = signal<Animal | null>(null);
  cargando = signal(true);
  error = signal('');
  
  // Estados para la solicitud
  enviandoSolicitud = signal(false);
  solicitudExitosa = signal(false);
  errorSolicitud = signal('');

  formularioSolicitud = this.fb.group({
    mensaje: ['', [Validators.required, Validators.minLength(15)]]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.cargarAnimal(id);
    } else {
      this.error.set('No se especificó un ID de animal válido.');
      this.cargando.set(false);
    }
  }

  cargarAnimal(id: number): void {
    this.cargando.set(true);
    this.error.set('');
    this.animalService.getAnimalPorId(id).subscribe({
      next: (data) => {
        this.animal.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la información del animal.');
        this.cargando.set(false);
      }
    });
  }

  enviarSolicitud(): void {
    const usuario = this.authService.usuarioActual();
    const anim = this.animal();

    if (!usuario) {
      this.errorSolicitud.set('Debes iniciar sesión para enviar una solicitud de adopción.');
      return;
    }

    if (!anim) {
      this.errorSolicitud.set('Información del animal no disponible.');
      return;
    }

    if (this.formularioSolicitud.invalid) {
      this.formularioSolicitud.markAllAsTouched();
      return;
    }

    this.enviandoSolicitud.set(true);
    this.errorSolicitud.set('');

    const mensaje = this.formularioSolicitud.value.mensaje || '';

    this.solicitudService.crearSolicitud({
      animal_id: anim.id,
      adoptante_id: usuario.id,
      mensaje: mensaje
    }).subscribe({
      next: () => {
        this.enviandoSolicitud.set(false);
        this.solicitudExitosa.set(true);
        this.formularioSolicitud.reset();
      },
      error: (err) => {
        this.enviandoSolicitud.set(false);
        const detalle = err.error?.detail || 'Ocurrió un error al enviar tu solicitud. Intenta nuevamente.';
        this.errorSolicitud.set(detalle);
      }
    });
  }
}
