import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CarnetPageRoutingModule } from './carnet-routing.module';
import { CarnetPage } from './carnet.page';

// 1. IMPORTAR LA LIBRERÍA
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarnetPageRoutingModule,
    QRCodeModule // <--- 2. ¡ESTO ES LO QUE TE FALTA!
  ],
  declarations: [CarnetPage]
})
export class CarnetPageModule {}