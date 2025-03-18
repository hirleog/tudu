import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuduProfessionalComponent } from './tudu-professional.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [TuduProfessionalComponent],
  imports: [CommonModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Adicione o CUSTOM_ELEMENTS_SCHEMA aqui
})
export class TuduProfessionalModule {}
