import { Routes } from '@angular/router';
import { ComponenteInicio } from './componentes/componente-inicio/componente-inicio';
import { ListadoAnimales } from './componentes/listado-animales/listado-animales';
import { DetalleAnimal } from './componentes/detalle-animal/detalle-animal';
import { Denuncias } from './componentes/denuncias/denuncias';
import { IniciarSesion } from './componentes/iniciar-sesion/iniciar-sesion';
import { Registro } from './componentes/registro/registro';
import { PanelRescatista } from './componentes/panel-rescatista/panel-rescatista';
import { PanelAdmin } from './componentes/panel-admin/panel-admin';

export const routes: Routes = [
  { path: '', component: ComponenteInicio },
  { path: 'animales', component: ListadoAnimales },
  { path: 'animales/:id', component: DetalleAnimal },
  { path: 'denuncias', component: Denuncias },
  { path: 'iniciar-sesion', component: IniciarSesion },
  { path: 'registro', component: Registro },
  { path: 'panel-rescatista', component: PanelRescatista },
  { path: 'panel-admin', component: PanelAdmin },
  { path: '**', redirectTo: '' }
];
