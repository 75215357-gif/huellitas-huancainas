export interface Solicitud {
  id?: number;
  animal_id: number;
  adoptante_id: number;
  mensaje?: string;
  estado?: 'pendiente' | 'aprobada' | 'rechazada';
  fecha_solicitud?: string;
}

export interface SolicitudCreate {
  animal_id: number;
  adoptante_id: number;
  mensaje?: string;
}
