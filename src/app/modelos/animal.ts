export interface Animal {
  id: number;
  nombre: string;
  especie: 'Perro' | 'Gato';
  edad: string;
  tamano: 'Pequeño' | 'Mediano' | 'Grande';
  caracter: string;
  vacunado: boolean;
  esterilizado: boolean;
  emoji: string;
}