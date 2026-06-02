import { Routes } from '@angular/router';
import { CatalogoComponent } from './pages/catalogo/catalogo';
import { InicioComponent } from './pages/inicio/inicio';
import { AgregarProductoComponent } from './agregar-producot/agregar-producot.component';
import { FooterInfoComponent } from './footer-info/footer-info.component';
import { EntregasComponent } from './pages/entregas/entregas';
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
    path: 'catalogo/:seccion',
    component: CatalogoComponent
  },

  {
    path: 'novedades',
    redirectTo: 'catalogo/novedades',
    pathMatch: 'full'
  },

  {
    path: 'promociones',
    redirectTo: 'catalogo/promociones',
    pathMatch: 'full'
  },

  {
    path: 'hombre',
    redirectTo: 'catalogo/hombre',
    pathMatch: 'full'
  },

  {
    path: 'mujer',
    redirectTo: 'catalogo/mujer',
    pathMatch: 'full'
  },

  {
    path: 'todo',
    redirectTo: 'catalogo/todo',
    pathMatch: 'full'
  },

  {
    path: 'entregas',
    component: EntregasComponent
  },

  {
    path: 'producto/nuevo',
    component: AgregarProductoComponent
  },

  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
  },

  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent)
  },

  {
  path: 'nosotros/:slug',
  component: FooterInfoComponent
},

{
  path: 'ayuda/:slug',
  component: FooterInfoComponent
},

{
  path: 'ayuda',
  redirectTo: 'ayuda/ayuda',
  pathMatch: 'full'
}


];
