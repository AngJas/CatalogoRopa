import { Routes } from '@angular/router';
import { CatalogoComponent } from './pages/catalogo/catalogo';
import { InicioComponent } from './pages/inicio/inicio';
import { AgregarProductoComponent } from './agregar-producot/agregar-producot.component';

export const routes: Routes = [
  {
    path: '',
    component: InicioComponent
  },

  {
    path: 'catalogo',
    component: CatalogoComponent
  },

  {
    path: 'producto/nuevo',
    component: AgregarProductoComponent
  }

];
