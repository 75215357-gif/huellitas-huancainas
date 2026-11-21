export interface Denuncia {
  id?: number;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  contacto?: string;
  estado?: 'pendiente' | 'en_revision' | 'atendida';
  fecha_denuncia?: string;
}

export interface DenunciaCreate {
  titulo: string;
  descripcion: string;
  ubicacion: string;
  contacto?: string;
}
