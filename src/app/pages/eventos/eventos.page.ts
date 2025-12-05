import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
  standalone: false
})
export class EventosPage implements OnInit {

  eventos: any[] = [];

  constructor(
    private api: ApiService,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarEventos();
  }

  ionViewWillEnter() {
    this.cargarEventos();
  }

  cargarEventos() {
    this.api.getEventos().subscribe({
      next: (res: any) => {
        this.eventos = res;
      },
      error: async (err) => {
        console.error(err);
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'No se pudieron cargar los eventos.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  // FUNCIÓN DE EDICIÓN (ENVÍA TODOS LOS DATOS, INCLUYENDO GPS)
  editar(evento: any) {
    this.router.navigate(['/nuevo-evento'], { 
      queryParams: { 
        modo: 'editar',
        id: evento.id,
        nombre: evento.nombre,
        lugar: evento.lugar,
        fecha: evento.fecha,
        latitud: evento.latitud,   // NUEVO: Coordenada
        longitud: evento.longitud // NUEVO: Coordenada
      }
    });
  }

  async confirmarBorrado(evento: any) {
    const alert = await this.alertCtrl.create({
      header: '¡Cuidado!',
      subHeader: `¿Eliminar "${evento.nombre}"?`,
      message: 'Si lo borras, SE PERDERÁN TODOS LOS ASISTENTES registrados en este evento.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar Todo',
          role: 'destructive',
          handler: () => {
            this.borrar(evento.id);
          }
        }
      ]
    });
    await alert.present();
  }

  borrar(id: number) {
    this.api.eliminarEvento(id).subscribe(() => {
      this.cargarEventos();
    });
  }
}