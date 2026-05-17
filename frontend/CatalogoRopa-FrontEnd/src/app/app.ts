import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './pages/header/header';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {


}
