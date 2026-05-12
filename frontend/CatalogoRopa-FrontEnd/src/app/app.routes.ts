import { Routes } from '@angular/router';
import { CatalogoComponent } from './pages/catalogo/catalogo';
import { InicioComponent } from './pages/inicio/inicio';

export const routes: Routes = [
  {
    path: '',
    component: InicioComponent
  },

  {
    path: 'catalogo',
    component: CatalogoComponent
  }

];
