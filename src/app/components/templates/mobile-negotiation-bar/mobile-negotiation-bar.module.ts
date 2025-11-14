import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileNegotiationBarComponent } from './mobile-negotiation-bar.component';
import { CustomModalModule } from 'src/app/shared/custom-modal/custom-modal.module';

@NgModule({
  declarations: [MobileNegotiationBarComponent],
  imports: [CommonModule, CustomModalModule],
  exports: [MobileNegotiationBarComponent],
})
export class MobileNegotiationBarModule {}
