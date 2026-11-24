import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Usuario {
  id: number;
  dni: string;
  nombres: string;
  telefono: string;
  correo: string;
  rol: string;
  estado_rescatista?: string;
  fecha_registro?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/auth';

  usuarioActual = signal<Usuario | null>(null);
  token = signal<string | null>(null);

  constructor() {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('usuario');
    if (savedToken && savedUser) {
      this.token.set(savedToken);
      try {
        this.usuarioActual.set(JSON.parse(savedUser));
      } catch {
        this.cerrarSesion();
      }
    }
  }

  login(correo: string, clave: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { correo, clave }).pipe(
      tap((res) => {
        this.token.set(res.access_token);
        this.usuarioActual.set(res.usuario);
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
      })
    );
  }

  registro(datos: {
    dni: string;
    nombres: string;
    telefono: string;
    correo: string;
    rol: string;
    clave: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/registro`, datos).pipe(
      tap((res) => {
        this.token.set(res.access_token);
        this.usuarioActual.set(res.usuario);
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
      })
    );
  }

  cerrarSesion(): void {
    this.token.set(null);
    this.usuarioActual.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }
}
