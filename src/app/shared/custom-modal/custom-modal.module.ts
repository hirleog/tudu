// custom-modal.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomModalComponent } from './custom-modal.component';

@NgModule({
  declarations: [CustomModalComponent],
  imports: [
    CommonModule, // ← ESSENCIAL: fornece *ngIf, *ngFor, etc.
  ],
  exports: [
    CustomModalComponent, // ← Permite que outros módulos usem o componente
  ],
})
export class CustomModalModule {}
