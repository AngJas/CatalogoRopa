import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PopupState {
  visible: boolean;
  type?: 'error' | 'success' | 'loading' | 'info';
  title?: string;
  message?: string;
}

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
