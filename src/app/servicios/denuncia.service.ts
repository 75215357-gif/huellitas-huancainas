import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Denuncia, DenunciaCreate } from '../modelos/denuncia';

@Injectable({
  providedIn: 'root'
})
export class DenunciaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/denuncias';

  getDenuncias(estado?: string): Observable<Denuncia[]> {
    let params = new HttpParams();
    if (estado) {
      params = params.set('estado', estado);
    }
    return this.http.get<Denuncia[]>(this.apiUrl, { params });
  }

  crearDenuncia(data: DenunciaCreate): Observable<Denuncia> {
    return this.http.post<Denuncia>(this.apiUrl, data);
  }

  actualizarEstado(id: number, estado: 'pendiente' | 'en_revision' | 'atendida'): Observable<Denuncia> {
    return this.http.patch<Denuncia>(`${this.apiUrl}/${id}`, { estado });
  }
}
