import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Animal } from '../modelos/animal';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/animales';

  getAnimales(especie?: string, tamano?: string): Observable<Animal[]> {
    let params = new HttpParams();
    if (especie) {
      params = params.set('especie', especie);
    }
    if (tamano) {
      params = params.set('tamano', tamano);
    }
    return this.http.get<Animal[]>(this.apiUrl, { params });
  }

  getAnimalPorId(id: number): Observable<Animal> {
    return this.http.get<Animal>(`${this.apiUrl}/${id}`);
  }
}
