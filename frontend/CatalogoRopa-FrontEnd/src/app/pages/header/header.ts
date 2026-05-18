import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  constructor(public auth: AuthService, private router: Router) {}

  get nombreUsuario() {
    const user = localStorage.getItem('user');
    if (!user) return null;
    try { return JSON.parse(user).nombre; } catch { return null; }
  }

  logout() {
    this.auth.logout();
  }

}
