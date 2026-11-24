export interface Solicitud {
  id?: number;
  animal_id: number;
  adoptante_id: number;
  mensaje?: string;
  estado?: 'pendiente' | 'aprobada' | 'rechazada';
  fecha_solicitud?: string;
  animal_nombre?: string;
  animal_especie?: string;
  animal_foto?: string;
  rescatista_id?: number;
  adoptante_nombres?: string;
  adoptante_correo?: string;
  adoptante_telefono?: string;
  adoptante_dni?: string;
}

export interface SolicitudCreate {
  animal_id: number;
  adoptante_id: number;
  mensaje?: string;
}
