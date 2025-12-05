import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-nuevo-evento',
  templateUrl: './nuevo-evento.page.html',
  styleUrls: ['./nuevo-evento.page.scss'],
  standalone: false
})
export class NuevoEventoPage implements OnInit {

  modoEdicion: boolean = false;
  eventoId: number = 0;
  
  nombre: string = '';
  lugar: string = '';
  fecha: string = new Date().toISOString(); 
  
  // Variable para la coordenada combinada (ej: "14.00, -87.00")
  coordenadaString: string = ''; 
  cargandoUbicacion: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params['modo'] === 'editar') {
        this.modoEdicion = true;
        this.eventoId = params['id'];
        this.nombre = params['nombre'];
        this.lugar = params['lugar'];
        if (params['fecha']) this.fecha = params['fecha'];
        
        // Si hay coordenadas guardadas, las combinamos en un solo string
        if (params['latitud'] && params['longitud'] && params['latitud'] !== 'null') {
            this.coordenadaString = `${params['latitud']}, ${params['longitud']}`;
        }
      }
    });
  }

  // --- FUNCIÓN PARA EL GPS (Captura la ubicación actual) ---
  async obtenerUbicacion() {
    this.cargandoUbicacion = true;
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.coordenadaString = `${coordinates.coords.latitude}, ${coordinates.coords.longitude}`;
      this.cargandoUbicacion = false;
    } catch (error) {
      this.cargandoUbicacion = false;
      this.mostrarError('No pudimos obtener tu ubicación. Asegúrate de tener el GPS encendido.');
    }
  }

  // --- FUNCIÓN PARA ABRIR MAPAS (Flujo de selección visual) ---
  async abrirMapasParaSeleccion() {
    // Usamos el centro de Honduras o la ubicación actual como punto de partida en el mapa
    const defaultCoords = this.coordenadaString || '14.0682, -87.2023'; 

    // Abrimos Google Maps en una nueva ventana/app
    window.open(`https://www.google.com/maps/search/?api=1&query=${defaultCoords}`, '_system');

    // Avisamos al usuario qué hacer.
    const alert = await this.alertCtrl.create({
      header: '¡Selecciona la ubicación!',
      message: '<strong>1. En el mapa que se abrió, pulsa y mantén presionado el lugar exacto.</strong><br><strong>2. Copia las coordenadas que aparecen (Ej: 14.07, -87.19).</strong><br><strong>3. Regresa y pégalas en el campo de Ubicación GPS.</strong>',
      buttons: ['¡Entendido!']
    });
    await alert.present();
  }

  // --- LIMPIAR COORDENADAS ---
  limpiarUbicacion() {
      this.coordenadaString = '';
  }

  async guardar() {
    if (!this.nombre || !this.lugar) {
      this.mostrarError('Escribe el nombre y lugar del evento.');
      return;
    }

    const mensaje = this.modoEdicion ? 'Actualizando...' : 'Creando evento...';
    const loading = await this.loadingCtrl.create({ message: mensaje });
    await loading.present();

    // Separamos el string de coordenadas (Ej: "14.00, -87.00")
    let latitud = null;
    let longitud = null;
    if (this.coordenadaString) {
        const parts = this.coordenadaString.split(',').map(p => p.trim());
        if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
            latitud = Number(parts[0]);
            longitud = Number(parts[1]);
        }
    }

    const datos = {
      nombre: this.nombre,
      lugar: this.lugar,
      fecha: this.fecha.split('T')[0],
      latitud: latitud,   
      longitud: longitud  
    };

    // ... (Lógica de actualizar/crear) ...
    if (this.modoEdicion) {
      this.api.actualizarEvento(this.eventoId, datos).subscribe({
        next: async () => { await loading.dismiss(); this.router.navigate(['/eventos']); },
        error: async (err) => { await loading.dismiss(); this.mostrarError('Error al actualizar'); }
      });
    } else {
      this.api.crearEvento(datos).subscribe({
        next: async () => { await loading.dismiss(); this.router.navigate(['/eventos']); },
        error: async (err) => { await loading.dismiss(); this.mostrarError('Error al crear'); }
      });
    }
  }

  async mostrarError(msg: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }
}