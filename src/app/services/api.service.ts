import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  // Tu URL de Ngrok (asegúrate de que sea la actual)
  private apiUrl = 'https://hotting-mycologic-yaritza.ngrok-free.dev/api'; 

  constructor(private http: HttpClient) { }

  // 1. MODIFICACIÓN: Acepta el tipo de respuesta ('json' o 'blob')
  private getHttpOptions(responseType: 'json' | 'blob' = 'json') { 
    return {
      headers: new HttpHeaders({
        'ngrok-skip-browser-warning': 'true' 
      }),
      responseType: responseType as 'json' // Usar responseType
    };
  }

  // 2. NUEVA FUNCIÓN PARA EL REPORTE PDF
  getReporte(eventoId: number) {
    // Pedimos la respuesta como 'blob' (archivo binario)
    return this.http.get(
      `${this.apiUrl}/asistentes/reporte/${eventoId}`, 
      {
        headers: new HttpHeaders({
          'ngrok-skip-browser-warning': 'true' 
        }),
        responseType: 'blob' as 'json' // Forzar el tipo a 'blob'
      }
    );
  }

  // Las funciones existentes se mantienen igual, pero internamente usan las opciones corregidas
  getEventos() {
    return this.http.get(`${this.apiUrl}/eventos`, this.getHttpOptions());
  }

  getAsistentesPorEvento(eventoId: number) {
    return this.http.get(`${this.apiUrl}/asistentes/${eventoId}`, this.getHttpOptions());
  }
  eliminarAsistente(id: number) {
    return this.http.delete(`${this.apiUrl}/asistentes/${id}`, this.getHttpOptions());
  }
crearEvento(datos: any) {
    return this.http.post(`${this.apiUrl}/eventos`, datos, this.getHttpOptions());
  }
  eliminarEvento(id: number) {
    return this.http.delete(`${this.apiUrl}/eventos/${id}`, this.getHttpOptions());
  }
  crearAsistente(datos: any) {
    // En POST también lo enviamos por si acaso
    return this.http.post(`${this.apiUrl}/asistentes`, datos, this.getHttpOptions());
  }
  actualizarEvento(id: number, datos: any) {
    return this.http.put(`${this.apiUrl}/eventos/${id}`, datos, this.getHttpOptions());
  }

  actualizarAsistente(id: number, datos: any) {
    return this.http.put(`${this.apiUrl}/asistentes/${id}`, datos, this.getHttpOptions());
  }
}