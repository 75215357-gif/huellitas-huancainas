import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Animal } from '../../modelos/animal';
import { AnimalService } from '../../servicios/animal.service';

@Component({
  selector: 'app-listado-animales',
  imports: [RouterLink],
  templateUrl: './listado-animales.html',
  styleUrl: './listado-animales.css',
})
export class ListadoAnimales implements OnInit {
  private animalService = inject(AnimalService);

  cargando = signal(true);
  error = signal<string | null>(null);

  // Datos de animales obtenidos desde la base de datos MySQL vía FastAPI
  animales = signal<Animal[]>([]);

  // Filtros
  busqueda = signal('');
  filtroEspecie = signal('');
  filtroTamano = signal('');

  ngOnInit(): void {
    this.cargarAnimales();
  }

  cargarAnimales(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.animalService.getAnimales().subscribe({
      next: (data) => {
        this.animales.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al conectar con la base de datos:', err);
        this.error.set('No se pudo conectar con el servidor MySQL.');
        this.cargando.set(false);
      }
    });
  }

  // Lista que se recalcula sola cuando cambia un filtro
  animalesFiltrados = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    return this.animales().filter(a =>
      a.nombre.toLowerCase().includes(texto) &&
      (this.filtroEspecie() === '' || a.especie === this.filtroEspecie()) &&
      (this.filtroTamano() === '' || a.tamano === this.filtroTamano())
    );
  });

  limpiarFiltros() {
    this.busqueda.set('');
    this.filtroEspecie.set('');
    this.filtroTamano.set('');
  }
}
