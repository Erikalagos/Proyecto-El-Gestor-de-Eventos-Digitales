import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public appPages = [
    // Solo dejamos una opción principal por ahora
    { title: 'Eventos', url: '/eventos', icon: 'calendar' },
    { title: 'Añadir Evento', url: '/nuevo-evento', icon: 'calendar' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
