import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/usuarios';

  getUsuarios(filtro?: { rol?: string; estado_rescatista?: string }): Observable<Usuario[]> {
    let params = new HttpParams();
    if (filtro?.rol) {
      params = params.set('rol', filtro.rol);
    }
    if (filtro?.estado_rescatista) {
      params = params.set('estado_rescatista', filtro.estado_rescatista);
    }
    return this.http.get<Usuario[]>(this.apiUrl, { params });
  }

  obtenerPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  actualizarUsuario(id: number, datos: Partial<Usuario>): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}`, datos);
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
