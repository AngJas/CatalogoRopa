import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BannerPromocionalComponent } from "../banner-promocional/banner-promocional.component";
import { CatalogoComponent } from "../catalogo/catalogo";

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, BannerPromocionalComponent, CatalogoComponent],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class InicioComponent {}
