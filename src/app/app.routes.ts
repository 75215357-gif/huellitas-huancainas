import { Routes } from '@angular/router';
import { ComponenteInicio }from './componentes/componente-inicio/componente-inicio';
import { ListadoAnimales } from './componentes/listado-animales/listado-animales';


export const routes: Routes = [
    {path: '', component: ComponenteInicio},
    {path: 'animales', component: ListadoAnimales},
];
