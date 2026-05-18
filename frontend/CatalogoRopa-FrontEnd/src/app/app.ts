import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './pages/header/header';
import { FooterComponent } from './footer/footer.component';
import { PopupMessageComponent } from './shared/popup/popup-message.component';

@Component({
  selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, FooterComponent, PopupMessageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {


}
