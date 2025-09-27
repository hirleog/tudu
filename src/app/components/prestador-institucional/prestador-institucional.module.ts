import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrestadorInstitucionalComponent } from './prestador-institucional.component';

const routes: Routes = [
  { path: '', component: PrestadorInstitucionalComponent },
];

@NgModule({
  declarations: [PrestadorInstitucionalComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes), // Importante: Use forChild() aqui
  ],
  exports: [PrestadorInstitucionalComponent],
})
export class PrestadorInstitucionalModule {}
