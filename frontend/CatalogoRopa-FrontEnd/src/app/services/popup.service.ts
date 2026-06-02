import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PopupState {
  visible: boolean;
  type?: 'error' | 'success' | 'loading' | 'info';
  title?: string;
  message?: string;
}

//Este es un servicio de angular que se encarga de manejar el estado de los popups en la aplicación.
//Utiliza un BehaviorSubject para mantener el estado actual del popup, que incluye si está visible o no, el tipo de popup (error, éxito, carga o información), el título y el mensaje.
//El servicio proporciona métodos para mostrar diferentes tipos de popups (error, éxito, carga e información) y un método para ocultar el popup. 
//Los componentes de la aplicación pueden suscribirse al estado del popup para mostrar u ocultar los popups según sea necesario.
@Injectable({ providedIn: 'root' })
export class PopupService {
  private state = new BehaviorSubject<PopupState>({ visible: false });
  state$ = this.state.asObservable();

  show(type: PopupState['type'], title?: string, message?: string) {
    this.state.next({ visible: true, type, title, message });
  }

  showError(title = 'Error', message = '') {
    this.show('error', title, message);
  }

  showSuccess(title = 'Éxito', message = '') {
    this.show('success', title, message);
  }

  showLoading(title = 'Cargando', message = '') {
    this.show('loading', title, message);
  }

  showInfo(title = 'Info', message = '') {
    this.show('info', title, message);
  }

  hide() {
    this.state.next({ visible: false });
  }
}
