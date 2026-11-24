import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, Usuario } from '../../servicios/auth.service';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './panel-admin.html',
  styleUrl: './panel-admin.css'
})
export class PanelAdmin implements OnInit {
  authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);

  pestanaActiva = signal<'solicitudes' | 'usuarios'>('solicitudes');

  usuarios = signal<Usuario[]>([]);
  cargando = signal<boolean>(true);
  procesandoId = signal<number | null>(null);

  mensajeExito = signal<string>('');
  errorMsg = signal<string>('');

  // Filtros
  filtroRol = signal<string>('todos');
  busqueda = signal<string>('');

  // Conteos calculados
  solicitudesPendientes = computed(() =>
    this.usuarios().filter((u) => u.estado_rescatista === 'pendiente')
  );

  conteoRescatistas = computed(() =>
    this.usuarios().filter((u) => u.rol === 'rescatista').length
  );

  conteoAdoptantes = computed(() =>
    this.usuarios().filter((u) => u.rol === 'adoptante').length
  );

  conteoAdmins = computed(() =>
    this.usuarios().filter((u) => u.rol === 'admin').length
  );

  // Lista filtrada para el directorio general
  usuariosFiltrados = computed(() => {
    const rol = this.filtroRol();
    const texto = this.busqueda().toLowerCase().trim();

    return this.usuarios().filter((u) => {
      if (rol !== 'todos' && u.rol !== rol) {
        return false;
      }
      if (texto) {
        const nombres = (u.nombres || '').toLowerCase();
        const correo = (u.correo || '').toLowerCase();
        const dni = (u.dni || '').toLowerCase();
        const telefono = (u.telefono || '').toLowerCase();
        if (!nombres.includes(texto) && !correo.includes(texto) && !dni.includes(texto) && !telefono.includes(texto)) {
          return false;
        }
      }
      return true;
    });
  });

  ngOnInit(): void {
    if (this.esAdmin()) {
      this.cargarUsuarios();
    }
  }

  esAdmin(): boolean {
    const u = this.authService.usuarioActual();
    return !!u && u.rol === 'admin';
  }

  cargarUsuarios(): void {
    this.cargando.set(true);
    this.usuarioService.getUsuarios().subscribe({
      next: (datos) => {
        this.usuarios.set(datos);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar lista de usuarios:', err);
        this.cargando.set(false);
        this.errorMsg.set('No se pudo conectar con el servidor de usuarios.');
      }
    });
  }

  aprobarRescatista(u: Usuario): void {
    this.procesandoId.set(u.id);
    this.mensajeExito.set('');
    this.errorMsg.set('');

    this.usuarioService.actualizarUsuario(u.id, {
      rol: 'rescatista',
      estado_rescatista: 'aprobado'
    }).subscribe({
      next: (actualizado) => {
        this.procesandoId.set(null);
        this.usuarios.update((lista) =>
          lista.map((item) =>
            item.id === u.id
              ? { ...item, rol: 'rescatista', estado_rescatista: 'aprobado' }
              : item
          )
        );
        this.mensajeExito.set(`¡Se aprobó a ${u.nombres} como Rescatista oficial de Huellitas Huancaínas!`);
        setTimeout(() => this.mensajeExito.set(''), 6000);
      },
      error: (err) => {
        this.procesandoId.set(null);
        console.error('Error al aprobar rescatista:', err);
        this.errorMsg.set('Ocurrió un error al intentar aprobar la cuenta.');
      }
    });
  }

  rechazarRescatista(u: Usuario): void {
    this.procesandoId.set(u.id);
    this.mensajeExito.set('');
    this.errorMsg.set('');

    this.usuarioService.actualizarUsuario(u.id, {
      rol: 'adoptante',
      estado_rescatista: 'rechazado'
    }).subscribe({
      next: () => {
        this.procesandoId.set(null);
        this.usuarios.update((lista) =>
          lista.map((item) =>
            item.id === u.id
              ? { ...item, rol: 'adoptante', estado_rescatista: 'rechazado' }
              : item
          )
        );
        this.mensajeExito.set(`Se rechazó la solicitud de rescatista para ${u.nombres}. Permanecerá como adoptante.`);
        setTimeout(() => this.mensajeExito.set(''), 6000);
      },
      error: (err) => {
        this.procesandoId.set(null);
        console.error('Error al rechazar solicitud:', err);
        this.errorMsg.set('Ocurrió un error al rechazar la solicitud.');
      }
    });
  }

  cambiarRolDirecto(u: Usuario, evento: Event): void {
    const select = evento.target as HTMLSelectElement;
    const nuevoRol = select.value as 'adoptante' | 'rescatista' | 'admin';

    if (nuevoRol === u.rol) return;

    this.procesandoId.set(u.id);
    const estadoRescatista = nuevoRol === 'rescatista' ? 'aprobado' : (nuevoRol === 'adoptante' ? 'ninguno' : 'aprobado');

    this.usuarioService.actualizarUsuario(u.id, {
      rol: nuevoRol,
      estado_rescatista: estadoRescatista
    }).subscribe({
      next: () => {
        this.procesandoId.set(null);
        this.usuarios.update((lista) =>
          lista.map((item) =>
            item.id === u.id ? { ...item, rol: nuevoRol, estado_rescatista: estadoRescatista } : item
          )
        );
        this.mensajeExito.set(`Rol de ${u.nombres} actualizado a "${nuevoRol.toUpperCase()}".`);
        setTimeout(() => this.mensajeExito.set(''), 5000);
      },
      error: (err) => {
        this.procesandoId.set(null);
        select.value = u.rol; // revertir select
        console.error('Error al cambiar rol:', err);
        this.errorMsg.set('No se pudo actualizar el rol del usuario.');
      }
    });
  }

  eliminarUsuario(u: Usuario): void {
    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar permanentemente al usuario ${u.nombres}?`);
    if (!confirmacion) return;

    this.procesandoId.set(u.id);
    this.usuarioService.eliminarUsuario(u.id).subscribe({
      next: () => {
        this.procesandoId.set(null);
        this.usuarios.update((lista) => lista.filter((item) => item.id !== u.id));
        this.mensajeExito.set(`Usuario ${u.nombres} eliminado correctamente.`);
        setTimeout(() => this.mensajeExito.set(''), 5000);
      },
      error: (err) => {
        this.procesandoId.set(null);
        console.error('Error al eliminar usuario:', err);
        this.errorMsg.set('No se pudo eliminar el usuario.');
      }
    });
  }

  formatearTelefonoParaWhatsApp(telefono?: string): string {
    if (!telefono) return '';
    const limpio = telefono.replace(/\D/g, '');
    return limpio.startsWith('51') ? limpio : `51${limpio}`;
  }
}
