
//En esta parte del codigo se definen las rutas de la aplicacion, 
//cada ruta se asocia a un componente que se renderiza cuando el usuario navega a esa ruta.
import { Routes } from '@angular/router';
import { CatalogoComponent } from './pages/catalogo/catalogo';
import { InicioComponent } from './pages/inicio/inicio';
import { AgregarProductoComponent } from './agregar-producot/agregar-producot.component';
import { FooterInfoComponent } from './footer-info/footer-info.component';
import { EntregasComponent } from './pages/entregas/entregas';
export const routes: Routes = [

  //Esta ruta es la ruta principal, que se muestra cuando el usuario navega a la raiz del sitio (http://localhost:4200/). Renderiza el componente InicioComponent.
  {
    path: '',
    component: InicioComponent
  },


  //Esta ruta se activa cuando el usuario navega a http://localhost:4200/catalogo. Renderiza el componente CatalogoComponent, que muestra el catálogo de ropa.
  {
    path: 'catalogo',
    component: CatalogoComponent
  },


  //Esta ruta se activa cuando el usuario navega a http://localhost:4200/catalogo/:seccion, 
  // donde :seccion es un parámetro dinámico que puede ser "novedades", "promociones", "hombre", "mujer" o "todo". 
  // Renderiza el mismo componente CatalogoComponent, pero con la sección específica del catálogo según el valor del parámetro.
  {
    path: 'catalogo/:seccion',
    component: CatalogoComponent
  },


  //Estas rutas son redirecciones que permiten que el usuario navegue a http://localhost:4200/novedades, http://localhost:4200/promociones, etc.,
  // y sean redirigidos automáticamente a la ruta correspondiente dentro del catálogo (http://localhost:4200/catalogo/novedades, etc.). 
  // Esto mejora la usabilidad al permitir accesos directos a secciones específicas del catálogo.
  {
    path: 'novedades',
    redirectTo: 'catalogo/novedades',
    pathMatch: 'full'
  },

  // Redirecciones para secciones específicas del catálogo
  {
    path: 'promociones',
    redirectTo: 'catalogo/promociones',
    pathMatch: 'full'
  },

  // Redirecciones para secciones específicas del catálogo
  {
    path: 'hombre',
    redirectTo: 'catalogo/hombre',
    pathMatch: 'full'
  },


  // Redirecciones para secciones específicas del catálogo
  {
    path: 'mujer',
    redirectTo: 'catalogo/mujer',
    pathMatch: 'full'
  },


  // Redirecciones para secciones específicas del catálogo
  {
    path: 'todo',
    redirectTo: 'catalogo/todo',
    pathMatch: 'full'
  },


  //Esta ruta se activa cuando el usuario navega a http://localhost:4200/entregas. 
  // Renderiza el componente EntregasComponent, que muestra la sección de entregas pendientes. 
  // cabe destacar que esta ruta solo es accesible para usuarios con rol de administrador, 
  // por lo que se debe implementar una guardia de rutas (route guard) para proteger esta ruta y evitar que usuarios no autorizados accedan a ella.
  {
    path: 'entregas',
    component: EntregasComponent
  },


  //Esta ruta se activa cuando el usuario navega a http://localhost:4200/producto/nuevo. 
  // Renderiza el componente AgregarProductoComponent, que permite a los administradores agregar nuevos productos al catálogo. 
  // Al igual que la ruta de entregas, esta ruta también debe estar protegida por una guardia de rutas para asegurar que solo los administradores puedan acceder a ella.
  {
    path: 'producto/nuevo',
    component: AgregarProductoComponent
  },


  //Esta ruta se activa cuando el usuario navega a http://localhost:4200/producto/editar/:id, donde :id es un parámetro dinámico que representa el ID del producto a editar.
  // Renderiza el mismo componente AgregarProductoComponent, pero en modo edición, permitiendo a los administradores modificar los detalles de un producto existente. 
  // Al igual que la ruta de nuevo producto, esta ruta también debe estar protegida por una guardia de rutas para asegurar que solo los administradores puedan acceder a ella.
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
  },


  //Esta ruta se activa cuando el usuario navega a http://localhost:4200/register. 
  // Renderiza el componente RegisterComponent, que permite a los usuarios registrarse en la plataforma. 
  // Esta ruta generalmente no requiere protección, ya que cualquier usuario debería poder acceder a ella para crear una cuenta.
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent)
  },


  //Esta ruta se activa cuando el usuario navega a http://localhost:4200/producto/editar/:id, donde :id es un parámetro dinámico que representa el ID del producto a editar.
  // Renderiza el mismo componente AgregarProductoComponent, pero en modo edición, permitiendo a los administradores modificar los detalles de un producto existente. 
  // Al igual que la ruta de nuevo producto, esta ruta también debe estar protegida por una guardia de rutas para asegurar que solo los administradores puedan acceder a ella.
  {
  path: 'nosotros/:slug',
  component: FooterInfoComponent
},

//Esta ruta se activa cuando el usuario navega a http://localhost:4200/nosotros, y es redirigida automáticamente a http://localhost:4200/nosotros/nosotros. 
// Esto permite que los usuarios accedan fácilmente a la sección "Nosotros" sin tener que especificar el slug, mejorando la usabilidad del sitio.

{
  path: 'ayuda/:slug',
  component: FooterInfoComponent
},

//Esta ruta se activa cuando el usuario navega a http://localhost:4200/ayuda, y es redirigida automáticamente a http://localhost:4200/ayuda/ayuda. 
// Esto permite que los usuarios accedan fácilmente a la sección "Ayuda" sin tener que especificar el slug, mejorando la usabilidad del sitio.
{
  path: 'ayuda',
  redirectTo: 'ayuda/ayuda',
  pathMatch: 'full'
}


];
