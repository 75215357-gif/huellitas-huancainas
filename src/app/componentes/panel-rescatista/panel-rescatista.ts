import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { SolicitudService } from '../../servicios/solicitud.service';
import { DenunciaService } from '../../servicios/denuncia.service';
import { AnimalService } from '../../servicios/animal.service';
import { Solicitud } from '../../modelos/solicitud';
import { Denuncia } from '../../modelos/denuncia';
import { Animal, AnimalCreate } from '../../modelos/animal';

@Component({
  selector: 'app-panel-rescatista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './panel-rescatista.html',
  styleUrl: './panel-rescatista.css'
})
export class PanelRescatista implements OnInit {
  authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private solicitudService = inject(SolicitudService);
  private denunciaService = inject(DenunciaService);
  private animalService = inject(AnimalService);

  // Pestaña actual: solicitudes | reportes | animales
  pestanaActiva = signal<'solicitudes' | 'reportes' | 'animales'>('solicitudes');

  // Mensajes de retroalimentación
  mensajeExito = signal<string>('');
  errorMsg = signal<string>('');
  procesandoId = signal<number | null>(null);

  // Estados Solicitudes
  solicitudes = signal<Solicitud[]>([]);
  cargandoSolicitudes = signal<boolean>(true);
  filtroEstadoSolicitud = signal<string>('todas');
  filtroSoloMios = signal<boolean>(false);
  busquedaSolicitud = signal<string>('');

  // Estados Reportes / Denuncias
  denuncias = signal<Denuncia[]>([]);
  cargandoDenuncias = signal<boolean>(true);
  filtroEstadoReporte = signal<string>('todas');
  busquedaReporte = signal<string>('');

  // Estados Animales Publicados
  misAnimales = signal<Animal[]>([]);
  cargandoAnimales = signal<boolean>(true);
  filtroEstadoAnimal = signal<string>('todos');
  busquedaAnimal = signal<string>('');
  mostrandoFormulario = signal<boolean>(false);
  guardandoAnimal = signal<boolean>(false);

  // Drag & Drop y subida de archivos
  arrastrandoArchivo = signal<boolean>(false);
  subiendoFoto = signal<boolean>(false);

  // Modelo de nuevo animal
  nuevoAnimal = signal<AnimalCreate>({
    nombre: '',
    especie: 'Perro',
    edad: '',
    tamano: 'Mediano',
    caracter: '',
    vacunado: true,
    esterilizado: false,
    foto: '',
    estado: 'disponible',
    rescatista_id: null
  });

  // Fotos predeterminadas disponibles en el albergue / assets
  fotosPredeterminadas = [
    { nombre: 'Toby (Perro)', url: 'http://localhost:8000/fotos-animales/toby.jpg' },
    { nombre: 'Luna (Gatita)', url: 'http://localhost:8000/fotos-animales/luna-gato.jpg' },
    { nombre: 'Canela (Perrita)', url: 'http://localhost:8000/fotos-animales/canela.jpg' },
    { nombre: 'Max (Perro grande)', url: 'http://localhost:8000/fotos-animales/max.jpg' },
    { nombre: 'Rocky (Perro guardián)', url: 'http://localhost:8000/fotos-animales/rocky-perro.jpg' },
    { nombre: 'Mía (Gatita cachorra)', url: 'http://localhost:8000/fotos-animales/mia-gato.jpg' }
  ];

  // Conteos calculados de solicitudes
  conteoPendientes = computed(() => this.solicitudes().filter(s => s.estado === 'pendiente').length);
  conteoAprobadas = computed(() => this.solicitudes().filter(s => s.estado === 'aprobada').length);
  conteoRechazadas = computed(() => this.solicitudes().filter(s => s.estado === 'rechazada').length);

  // Lista filtrada de solicitudes
  solicitudesFiltradas = computed(() => {
    const estado = this.filtroEstadoSolicitud();
    const soloMios = this.filtroSoloMios();
    const busq = this.busquedaSolicitud().toLowerCase().trim();
    const user = this.authService.usuarioActual();

    return this.solicitudes().filter(s => {
      if (estado !== 'todas' && s.estado !== estado) {
        return false;
      }
      if (soloMios && user && s.rescatista_id !== user.id) {
        return false;
      }
      if (busq) {
        const nombreAnimal = (s.animal_nombre || '').toLowerCase();
        const nombreAdoptante = (s.adoptante_nombres || '').toLowerCase();
        const dniAdoptante = (s.adoptante_dni || '').toLowerCase();
        if (!nombreAnimal.includes(busq) && !nombreAdoptante.includes(busq) && !dniAdoptante.includes(busq)) {
          return false;
        }
      }
      return true;
    });
  });

  // Conteos calculados de denuncias
  conteoReportesPendientes = computed(() => this.denuncias().filter(d => d.estado === 'pendiente').length);
  conteoReportesEnRevision = computed(() => this.denuncias().filter(d => d.estado === 'en_revision').length);
  conteoReportesAtendidas = computed(() => this.denuncias().filter(d => d.estado === 'atendida').length);

  // Lista filtrada de reportes
  denunciasFiltradas = computed(() => {
    const estado = this.filtroEstadoReporte();
    const busq = this.busquedaReporte().toLowerCase().trim();

    return this.denuncias().filter(d => {
      if (estado !== 'todas' && d.estado !== estado) {
        return false;
      }
      if (busq) {
        const titulo = (d.titulo || '').toLowerCase();
        const ubicacion = (d.ubicacion || '').toLowerCase();
        const descripcion = (d.descripcion || '').toLowerCase();
        if (!titulo.includes(busq) && !ubicacion.includes(busq) && !descripcion.includes(busq)) {
          return false;
        }
      }
      return true;
    });
  });

  // Conteos calculados de animales publicados
  conteoAnimalesDisponibles = computed(() => this.misAnimales().filter(a => a.estado === 'disponible').length);
  conteoAnimalesEnProceso = computed(() => this.misAnimales().filter(a => a.estado === 'en_proceso').length);
  conteoAnimalesAdoptados = computed(() => this.misAnimales().filter(a => a.estado === 'adoptado').length);

  // Lista filtrada de animales
  animalesFiltrados = computed(() => {
    const estado = this.filtroEstadoAnimal();
    const busq = this.busquedaAnimal().toLowerCase().trim();

    return this.misAnimales().filter(a => {
      if (estado !== 'todos' && a.estado !== estado) {
        return false;
      }
      if (busq) {
        const nom = (a.nombre || '').toLowerCase();
        const esp = (a.especie || '').toLowerCase();
        const car = (a.caracter || '').toLowerCase();
        if (!nom.includes(busq) && !esp.includes(busq) && !car.includes(busq)) {
          return false;
        }
      }
      return true;
    });
  });

  ngOnInit(): void {
    const tabParam = this.route.snapshot.queryParamMap.get('tab');
    if (tabParam === 'animales' || tabParam === 'publicar') {
      this.pestanaActiva.set('animales');
      if (tabParam === 'publicar') {
        this.mostrandoFormulario.set(true);
      }
    }

    if (this.esRescatistaOAdmin()) {
      this.cargarSolicitudes();
      this.cargarDenuncias();
      this.cargarMisAnimales();
    }
  }

  esRescatistaOAdmin(): boolean {
    const user = this.authService.usuarioActual();
    return !!user && (user.rol === 'rescatista' || user.rol === 'admin');
  }

  cargarSolicitudes(): void {
    this.cargandoSolicitudes.set(true);
    this.solicitudService.getSolicitudes().subscribe({
      next: (datos) => {
        this.solicitudes.set(datos);
        this.cargandoSolicitudes.set(false);
      },
      error: (err) => {
        console.error('Error al cargar solicitudes:', err);
        this.cargandoSolicitudes.set(false);
      }
    });
  }

  cargarDenuncias(): void {
    this.cargandoDenuncias.set(true);
    this.denunciaService.getDenuncias().subscribe({
      next: (datos) => {
        this.denuncias.set(datos);
        this.cargandoDenuncias.set(false);
      },
      error: (err) => {
        console.error('Error al cargar reportes:', err);
        this.cargandoDenuncias.set(false);
      }
    });
  }

  cargarMisAnimales(): void {
    this.cargandoAnimales.set(true);
    const user = this.authService.usuarioActual();
    const filtro = user && user.rol !== 'admin' ? { rescatista_id: user.id } : undefined;

    this.animalService.getAnimales(filtro).subscribe({
      next: (datos) => {
        this.misAnimales.set(datos);
        this.cargandoAnimales.set(false);
      },
      error: (err) => {
        console.error('Error al cargar animales:', err);
        this.cargandoAnimales.set(false);
      }
    });
  }

  cambiarEstadoSolicitud(solicitud: Solicitud, nuevoEstado: 'pendiente' | 'aprobada' | 'rechazada'): void {
    if (!solicitud.id) return;

    this.procesandoId.set(solicitud.id);
    this.mensajeExito.set('');
    this.errorMsg.set('');

    this.solicitudService.cambiarEstado(solicitud.id, nuevoEstado).subscribe({
      next: () => {
        this.procesandoId.set(null);
        this.solicitudes.update((prev) =>
          prev.map((s) => (s.id === solicitud.id ? { ...s, estado: nuevoEstado } : s))
        );
        const accionTexto = nuevoEstado === 'aprobada' ? 'aprobada' : (nuevoEstado === 'rechazada' ? 'rechazada' : 'puesta en pendiente');
        this.mensajeExito.set(`La solicitud para ${solicitud.animal_nombre || 'la mascota'} ha sido ${accionTexto} con éxito.`);
        setTimeout(() => this.mensajeExito.set(''), 5000);
      },
      error: (err) => {
        this.procesandoId.set(null);
        console.error('Error al cambiar estado de solicitud:', err);
        this.errorMsg.set('No se pudo actualizar el estado de la solicitud. Intente nuevamente.');
      }
    });
  }

  cambiarEstadoReporte(denuncia: Denuncia, nuevoEstado: 'pendiente' | 'en_revision' | 'atendida'): void {
    if (!denuncia.id) return;

    this.procesandoId.set(denuncia.id);
    this.mensajeExito.set('');
    this.errorMsg.set('');

    this.denunciaService.actualizarEstado(denuncia.id, nuevoEstado).subscribe({
      next: () => {
        this.procesandoId.set(null);
        this.denuncias.update((prev) =>
          prev.map((d) => (d.id === denuncia.id ? { ...d, estado: nuevoEstado } : d))
        );
        const accion = nuevoEstado === 'en_revision' ? 'puesta en revisión' : (nuevoEstado === 'atendida' ? 'marcada como atendida' : 'marcada como pendiente');
        this.mensajeExito.set(`El reporte "${denuncia.titulo}" ha sido ${accion}.`);
        setTimeout(() => this.mensajeExito.set(''), 5000);
      },
      error: (err) => {
        this.procesandoId.set(null);
        console.error('Error al actualizar reporte:', err);
        this.errorMsg.set('No se pudo actualizar el estado del reporte. Intente nuevamente.');
      }
    });
  }

  // Métodos para publicar y gestionar animales
  seleccionarFoto(url: string): void {
    this.nuevoAnimal.update(prev => ({ ...prev, foto: url }));
  }

  limpiarFoto(): void {
    this.nuevoAnimal.update(prev => ({ ...prev, foto: '' }));
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.arrastrandoArchivo.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.arrastrandoArchivo.set(false);
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.arrastrandoArchivo.set(false);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.procesarArchivoImagen(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.procesarArchivoImagen(input.files[0]);
    }
  }

  procesarArchivoImagen(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.errorMsg.set('El archivo seleccionado debe ser una imagen válida (JPG, PNG o WEBP).');
      return;
    }

    this.subiendoFoto.set(true);
    this.errorMsg.set('');

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Mostrar vista previa inmediata en el formulario
      this.nuevoAnimal.update(prev => ({ ...prev, foto: base64 }));

      // Guardar archivo en la carpeta public/fotos-animales vía API
      this.animalService.subirFoto(file.name, base64).subscribe({
        next: (res) => {
          this.subiendoFoto.set(false);
          this.nuevoAnimal.update(prev => ({ ...prev, foto: res.url }));
          this.mensajeExito.set(`Foto "${file.name}" cargada exitosamente.`);
          setTimeout(() => this.mensajeExito.set(''), 4000);
        },
        error: (err) => {
          this.subiendoFoto.set(false);
          console.warn('Aviso: guardando imagen en formato base64 embebido:', err);
        }
      });
    };
    reader.readAsDataURL(file);
  }

  publicarMascota(): void {
    const val = this.nuevoAnimal();
    if (!val.nombre.trim()) {
      this.errorMsg.set('El nombre de la mascota es obligatorio.');
      return;
    }
    if (!val.edad.trim()) {
      this.errorMsg.set('Ingresa la edad aproximada del animal.');
      return;
    }
    if (!val.caracter.trim()) {
      this.errorMsg.set('Describe el temperamento o carácter del animal.');
      return;
    }
    if (!val.foto.trim()) {
      this.errorMsg.set('Indica una foto para la mascota.');
      return;
    }

    const usuario = this.authService.usuarioActual();
    this.guardandoAnimal.set(true);
    this.mensajeExito.set('');
    this.errorMsg.set('');

    const payload: AnimalCreate = {
      ...val,
      rescatista_id: usuario ? usuario.id : null
    };

    this.animalService.crearAnimal(payload).subscribe({
      next: (creado) => {
        this.guardandoAnimal.set(false);
        this.misAnimales.update(prev => [creado, ...prev]);
        this.mensajeExito.set(`¡${creado.nombre} ha sido publicado exitosamente en el catálogo de adopción!`);
        this.mostrandoFormulario.set(false);
        // Reset form
        this.nuevoAnimal.set({
          nombre: '',
          especie: 'Perro',
          edad: '',
          tamano: 'Mediano',
          caracter: '',
          vacunado: true,
          esterilizado: false,
          foto: '',
          estado: 'disponible',
          rescatista_id: null
        });
        setTimeout(() => this.mensajeExito.set(''), 6000);
      },
      error: (err) => {
        this.guardandoAnimal.set(false);
        console.error('Error al publicar animal:', err);
        this.errorMsg.set('No se pudo publicar la mascota. Revisa que todos los campos sean correctos.');
      }
    });
  }

  cambiarEstadoAnimal(animal: Animal, nuevoEstado: 'disponible' | 'en_proceso' | 'adoptado'): void {
    this.procesandoId.set(animal.id);
    this.animalService.actualizarAnimal(animal.id, { estado: nuevoEstado }).subscribe({
      next: () => {
        this.procesandoId.set(null);
        this.misAnimales.update(lista =>
          lista.map(a => a.id === animal.id ? { ...a, estado: nuevoEstado } : a)
        );
        this.mensajeExito.set(`Estado de ${animal.nombre} cambiado a "${nuevoEstado.toUpperCase()}".`);
        setTimeout(() => this.mensajeExito.set(''), 4000);
      },
      error: (err) => {
        this.procesandoId.set(null);
        console.error('Error al actualizar estado del animal:', err);
        this.errorMsg.set('No se pudo actualizar el estado.');
      }
    });
  }

  eliminarAnimal(animal: Animal): void {
    const confirmacion = confirm(`¿Estás seguro de que deseas retirar de publicación a ${animal.nombre}?`);
    if (!confirmacion) return;

    this.procesandoId.set(animal.id);
    this.animalService.eliminarAnimal(animal.id).subscribe({
      next: () => {
        this.procesandoId.set(null);
        this.misAnimales.update(lista => lista.filter(a => a.id !== animal.id));
        this.mensajeExito.set(`${animal.nombre} ha sido retirado de publicación.`);
        setTimeout(() => this.mensajeExito.set(''), 4000);
      },
      error: (err) => {
        this.procesandoId.set(null);
        console.error('Error al eliminar animal:', err);
        this.errorMsg.set('No se pudo eliminar la publicación.');
      }
    });
  }

  formatearTelefonoParaWhatsApp(telefono?: string): string {
    if (!telefono) return '';
    const limpio = telefono.replace(/\D/g, '');
    return limpio.startsWith('51') ? limpio : `51${limpio}`;
  }
}
