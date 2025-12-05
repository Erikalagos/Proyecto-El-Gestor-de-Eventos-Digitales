import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage implements OnInit {

  modoEdicion: boolean = false;
  asistenteId: number = 0;
  eventoId: number = 0;
  
  nombre: string = '';
  email: string = '';
  foto: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    // Obtener ID del evento de la ruta URL
    this.eventoId = Number(this.route.snapshot.paramMap.get('eventoId'));

    // Verificar si venimos a EDITAR (queryParams)
    this.route.queryParams.subscribe(params => {
      if (params && params['modo'] === 'editar') {
        this.modoEdicion = true;
        this.asistenteId = params['id'];
        this.nombre = params['nombre'];
        this.email = params['email'];
        this.foto = params['foto'];
      }
    });
  }

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
      this.foto = image.dataUrl!;
    } catch (error) {
      console.log('Error cámara:', error);
    }
  }

  async guardar() {
    if (!this.nombre || !this.email || !this.foto) {
      const alert = await this.alertCtrl.create({
        header: 'Faltan datos',
        message: 'Por favor completa todos los campos y la foto.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const mensaje = this.modoEdicion ? 'Actualizando...' : 'Registrando...';
    const loading = await this.loadingCtrl.create({ message: mensaje });
    await loading.present();

    const datos = {
      nombre: this.nombre,
      email: this.email,
      fotoPerfilDataUrl: this.foto,
      eventoId: this.eventoId
    };

    if (this.modoEdicion) {
      // --- ACTUALIZAR ---
      this.api.actualizarAsistente(this.asistenteId, datos).subscribe({
        next: async () => {
          await loading.dismiss();
          this.router.navigate(['/lista-asistentes', this.eventoId]);
        },
        error: async (err) => {
          await loading.dismiss();
          this.mostrarError('No se pudo actualizar el asistente.');
        }
      });
    } else {
      // --- CREAR ---
      this.api.crearAsistente(datos).subscribe({
        next: async () => {
          await loading.dismiss();
          this.router.navigate(['/lista-asistentes', this.eventoId]);
        },
        error: async (err) => {
          await loading.dismiss();
          if (err.status === 409) {
             this.mostrarError('Ese correo ya está registrado.');
          } else {
             this.mostrarError('No se pudo registrar.');
          }
        }
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