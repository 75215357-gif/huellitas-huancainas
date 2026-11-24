import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Animal, AnimalCreate } from '../modelos/animal';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/animales';

  getAnimales(filtro?: {
    especie?: string;
    tamano?: string;
    rescatista_id?: number;
    estado?: string;
  }): Observable<Animal[]> {
    let params = new HttpParams();
    if (filtro?.especie) {
      params = params.set('especie', filtro.especie);
    }
    if (filtro?.tamano) {
      params = params.set('tamano', filtro.tamano);
    }
    if (filtro?.rescatista_id) {
      params = params.set('rescatista_id', filtro.rescatista_id.toString());
    }
    if (filtro?.estado) {
      params = params.set('estado', filtro.estado);
    }
    return this.http.get<Animal[]>(this.apiUrl, { params });
  }

  getAnimalPorId(id: number): Observable<Animal> {
    return this.http.get<Animal>(`${this.apiUrl}/${id}`);
  }

  crearAnimal(data: AnimalCreate): Observable<Animal> {
    return this.http.post<Animal>(this.apiUrl, data);
  }

  subirFoto(nombreArchivo: string, imagenBase64: string): Observable<{ url: string; nombre: string }> {
    return this.http.post<{ url: string; nombre: string }>(`${this.apiUrl}/subir-foto`, {
      nombre_archivo: nombreArchivo,
      imagen_base64: imagenBase64
    });
  }

  actualizarAnimal(id: number, data: Partial<Animal>): Observable<Animal> {
    return this.http.patch<Animal>(`${this.apiUrl}/${id}`, data);
  }

  eliminarAnimal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
