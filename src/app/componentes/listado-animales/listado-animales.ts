import { Component, computed, signal } from '@angular/core';
import { Animal } from '../../modelos/animal';

@Component({
  selector: 'app-listado-animales',
  imports: [],
  templateUrl: './listado-animales.html',
  styleUrl: './listado-animales.css',
})
export class ListadoAnimales {
  // Datos de animales
  animales = signal<Animal[]>([
    { id: 1, nombre: 'Toby', especie: 'Perro', edad: '2 años', tamano: 'Mediano', caracter: 'Juguetón y cariñoso', vacunado: true, esterilizado: true, foto: '/fotos-animales/toby.jpg' },
    { id: 2, nombre: 'Luna', especie: 'Gato', edad: '1 año', tamano: 'Pequeño', caracter: 'Tranquila y sociable', vacunado: true, esterilizado: true, foto: '/fotos-animales/luna-gato.jpg' },
    { id: 3, nombre: 'Rocky', especie: 'Perro', edad: '4 años', tamano: 'Grande', caracter: 'Protector y leal', vacunado: true, esterilizado: false, foto: '/fotos-animales/rocky-perro.jpg' },
    { id: 4, nombre: 'Mía', especie: 'Gato', edad: '6 meses', tamano: 'Pequeño', caracter: 'Curiosa y activa', vacunado: false, esterilizado: false, foto: '/fotos-animales/mia-gato.jpg' },
    { id: 5, nombre: 'Canela', especie: 'Perro', edad: '3 años', tamano: 'Pequeño', caracter: 'Dócil con niños', vacunado: true, esterilizado: true, foto: '/fotos-animales/canela.jpg' },
    { id: 6, nombre: 'Max', especie: 'Perro', edad: '5 años', tamano: 'Grande', caracter: 'Tranquilo, ideal para casa con patio', vacunado: true, esterilizado: true, foto: '/fotos-animales/max.jpg' },
  ]);

  // Filtros
  busqueda = signal('');
  filtroEspecie = signal('');
  filtroTamano = signal('');

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
