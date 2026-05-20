import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-popup-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-message.html',
  styleUrls: ['./popup-message.css']
})
export class PopupMessageComponent {
  constructor(public popup: PopupService) {}

  close() {
    this.popup.hide();
  }
}
