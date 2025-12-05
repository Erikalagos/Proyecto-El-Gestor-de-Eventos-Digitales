import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
// IMPORTS NECESARIOS PARA LA DESCARGA
import * as html2canvas from 'html2canvas'; // <-- Importación robusta para compatibilidad
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Component({
  selector: 'app-carnet',
  templateUrl: './carnet.page.html',
  styleUrls: ['./carnet.page.scss'],
  standalone: false 
})
export class CarnetPage implements OnInit {

  @Input() asistente: any;
  qrData: string = '';

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    const datosSeguros = {
      id: this.asistente.id,
      email: this.asistente.email,
      evento: this.asistente.eventoId
    };
     this.qrData = JSON.stringify(datosSeguros);
    console.log('Datos recibidos en el carnet:', this.asistente);
    
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }
  
  /**
   * FUNCIÓN PARA CONVERTIR EL CARNET HTML EN UNA IMAGEN PNG Y GUARDARLO
   */
  async descargarCarnet() {
    
    // CORRECCIÓN #1: Añadir un pequeño retraso para que el DOM se estabilice
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    try {
      const carnetElement = document.querySelector('.contenedor-carnet') as HTMLElement;
      if (!carnetElement) {
        console.error('Elemento del carnet no encontrado');
        alert('❌ No se pudo descargar el carnet. (Detalle: Elemento principal no encontrado)');
        return;
      }

      // CORRECCIÓN #2: Crea una referencia a la función real de html2canvas (fix de TS2349)
      const html2canvasInstance = (html2canvas as any).default || html2canvas;
      
      const canvas = await html2canvasInstance(carnetElement, { 
        allowTaint: true,
        useCORS: false,
        scale: 2,
        // CORRECCIÓN #3: Ajustes para manejar la clonación en modales
        foreignObjectRendering: false, 
        imageTimeout: 5000, 
        ignoreElements: (element: Element) => {
  return element.tagName === 'IFRAME'; 
}
      });
      
      const base64Image = canvas.toDataURL('image/png').split(',')[1];
      
      const nombreLimpio = this.asistente.nombre ? this.asistente.nombre.replace(/\s/g, '_') : 'Asistente';
      const nombreArchivo = `Carnet_${nombreLimpio}_${this.asistente.id}.png`;
      
      await Filesystem.writeFile({
        path: nombreArchivo,
        data: base64Image,
        directory: Directory.Documents, 
        // CORRECCIÓN #4: Usamos la cadena literal con Type Cast para resolver TS2322
        encoding: 'base64' as any 
      });

      alert(`Carnet guardado en tus documentos como ${nombreArchivo}`);
      
    } catch (error) {
      console.error('Error al descargar el carnet:', error);
      alert(' No se pudo descargar el carnet. (Detalle: ' + error + ')');
    }
  }
}