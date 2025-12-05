import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
// Importar LoadingController para el spinner
import { AlertController, ModalController, LoadingController } from '@ionic/angular'; 
import { CarnetPage } from '../carnet/carnet.page';

// IMPORTS NECESARIOS PARA EL REPORTE
import { saveAs } from 'file-saver'; 
// Importar componentes de Capacitor
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core'; // Importar Capacitor para verificar la plataforma

@Component({
  selector: 'app-lista-asistentes',
  templateUrl: './lista-asistentes.page.html',
  styleUrls: ['./lista-asistentes.page.scss'],
  standalone: false
})
export class ListaAsistentesPage implements OnInit {

  asistentes: any[] = [];
  asistentesFiltrados: any[] = [];
  eventoId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController // Inyectar LoadingController
  ) { }

  ngOnInit() {
    this.eventoId = Number(this.route.snapshot.paramMap.get('eventoId'));
  }

  ionViewWillEnter() {
    this.cargarAsistentes();
  }

  cargarAsistentes() {
    this.api.getAsistentesPorEvento(this.eventoId).subscribe((res: any) => {
      this.asistentes = res;
      this.asistentesFiltrados = res;
    });
  }

  // =======================================================
  // --- FUNCIÓN FINAL: DESCARGAR REPORTE (SOPORTE MÓVIL) ---
  // =======================================================
  async descargarReporte() {
    // CORRECCIÓN DE TS2339: Usamos getPlatform() para determinar si es móvil
    const isMobile = Capacitor.getPlatform() !== 'web';

    const loading = await this.loadingCtrl.create({
        message: 'Generando reporte...',
    });
    await loading.present();

    this.api.getReporte(this.eventoId).subscribe({
        next: async (blob: any) => { 
            await loading.dismiss();
            
            const filename = `Reporte_Asistentes_Evento_${this.eventoId}.pdf`;

            if (isMobile) {
                // LÓGICA DE GUARDADO NATIVO CON CAPACITOR
                
                // 1. Convertir Blob a Base64 (Devuelve el Data URL completo: 'data:application/pdf;base64,...')
                const base64Data = await this.convertBlobToBase64(blob);
                
                // 2. Guardar en la carpeta de Documentos
                await Filesystem.writeFile({
                    path: filename,
                    // CORRECCIÓN DE ARCHIVO CORRUPTO: Usamos .split(',')[1] para quitar el prefijo
                    data: base64Data.split(',')[1] || base64Data, 
                    directory: Directory.Documents,
                    encoding: 'base64' as any,
                    recursive: true
                });
                this.mostrarMensaje(`✅ Reporte guardado en la carpeta DOCUMENTOS de tu teléfono. Búscalo con la app "Archivos" o "Gestor de Archivos".`, 'Descarga Exitosa');

            } else {
                // LÓGICA DE GUARDADO WEB CON file-saver
                saveAs(blob, filename);
                this.mostrarMensaje('✅ Reporte generado y descargado correctamente.', 'Éxito');
            }
        },
        error: async (err) => {
            await loading.dismiss();
            console.error(err);
            this.mostrarMensaje('❌ Error al descargar el reporte. Revisa la consola y que la API esté activa.', 'Error');
        }
    });
  }

  // FUNCIÓN AUXILIAR: Convierte Blob a Data URL (requerido por Filesystem.writeFile)
  private convertBlobToBase64 = (blob: Blob) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
          // Devuelve el Data URL completo (Ej: 'data:application/pdf;base64,...')
          resolve(reader.result as string); 
      };
      reader.readAsDataURL(blob);
  });
  // =======================================================

  // --- FUNCIÓN: EDITAR (Existente) ---
  editar(asistente: any) {
    this.router.navigate(['/registro', this.eventoId], {
      queryParams: {
        modo: 'editar',
        id: asistente.id,
        nombre: asistente.nombre,
        email: asistente.email,
        foto: asistente.fotoPerfilDataUrl
      }
    });
  }

  async confirmarBorrado(asistente: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: `¿Seguro que deseas eliminar a ${asistente.nombre}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.borrar(asistente.id);
          }
        }
      ]
    });
    await alert.present();
  }

  borrar(id: number) {
    this.api.eliminarAsistente(id).subscribe(() => {
      this.cargarAsistentes();
    });
  }

  filtrar(event: any) {
    const busqueda = event.target.value.toLowerCase();
    if (!busqueda || busqueda.trim() === '') {
      this.asistentesFiltrados = this.asistentes; 
    } else {
      this.asistentesFiltrados = this.asistentes.filter(p => 
        p.nombre.toLowerCase().includes(busqueda) || 
        p.email.toLowerCase().includes(busqueda)
      );
    }
  }

  async verCarnet(asistente: any) {
    const modal = await this.modalCtrl.create({
      component: CarnetPage,
      componentProps: { asistente: asistente }
    });
    await modal.present();
  }
  
  // Función auxiliar para mostrar mensajes (Existente)
  async mostrarMensaje(msg: string, title: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }
}