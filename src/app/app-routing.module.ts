import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'eventos', // Redirigir a eventos al iniciar
    pathMatch: 'full'
  },
  {
    path: 'eventos',
    loadChildren: () => import('./pages/eventos/eventos.module').then( m => m.EventosPageModule)
  },
  {
    // Fíjate en el /:eventoId, así pasamos el dato
    path: 'lista-asistentes/:eventoId', 
    loadChildren: () => import('./pages/lista-asistentes/lista-asistentes.module').then( m => m.ListaAsistentesPageModule)
  },
  {
    path: 'registro/:eventoId',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  // Puedes dejar la carpeta folder si quieres, o borrarla
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'carnet',
    loadChildren: () => import('./pages/carnet/carnet.module').then( m => m.CarnetPageModule)
  },
  {
    path: 'nuevo-evento',
    loadChildren: () => import('./pages/nuevo-evento/nuevo-evento.module').then( m => m.NuevoEventoPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}