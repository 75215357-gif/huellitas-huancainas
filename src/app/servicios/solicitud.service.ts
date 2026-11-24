import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitud, SolicitudCreate } from '../modelos/solicitud';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/solicitudes';

  getSolicitudes(filtro?: { estado?: string; rescatista_id?: number }): Observable<Solicitud[]> {
    let params = new HttpParams();
    if (filtro?.estado) {
      params = params.set('estado', filtro.estado);
    }
    if (filtro?.rescatista_id) {
      params = params.set('rescatista_id', filtro.rescatista_id.toString());
    }
    return this.http.get<Solicitud[]>(this.apiUrl, { params });
  }

  crearSolicitud(data: SolicitudCreate): Observable<Solicitud> {
    return this.http.post<Solicitud>(this.apiUrl, data);
  }

  cambiarEstado(id: number, nuevoEstado: 'pendiente' | 'aprobada' | 'rechazada'): Observable<Solicitud> {
    return this.http.patch<Solicitud>(`${this.apiUrl}/${id}/estado`, { estado: nuevoEstado });
  }
}
