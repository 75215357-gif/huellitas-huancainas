import { Routes } from '@angular/router';
import { ComponenteInicio }from './componentes/componente-inicio/componente-inicio';
import { ListadoAnimales } from './componentes/listado-animales/listado-animales';
import { IniciarSesion } from './componentes/iniciar-sesion/iniciar-sesion';
import { Registro } from './componentes/registro/registro';

export const routes: Routes = [
    {path: '', component: ComponenteInicio},
    {path: 'animales', component: ListadoAnimales},
    {path: 'iniciar-sesion', component: IniciarSesion},
    {path: 'registro', component: Registro},
    
];
