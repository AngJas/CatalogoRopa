import { Component } from '@angular/core';
import { BannerPromocionalComponent } from "../banner-promocional/banner-promocional.component";
import { CatalogoComponent } from "../catalogo/catalogo";

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [BannerPromocionalComponent, CatalogoComponent],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class InicioComponent {}
