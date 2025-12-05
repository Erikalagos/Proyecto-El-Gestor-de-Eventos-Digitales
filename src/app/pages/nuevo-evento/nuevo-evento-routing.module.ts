import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevoEventoPage } from './nuevo-evento.page';

const routes: Routes = [
  {
    path: '',
    component: NuevoEventoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevoEventoPageRoutingModule {}
