import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaAsistentesPageRoutingModule } from './lista-asistentes-routing.module';

import { ListaAsistentesPage } from './lista-asistentes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaAsistentesPageRoutingModule
  ],
  declarations: [ListaAsistentesPage]
})
export class ListaAsistentesPageModule {}
