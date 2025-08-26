import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsComponent } from './payments.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomModalModule } from 'src/app/shared/custom-modal/custom-modal.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CustomModalModule
  ],
  declarations: [PaymentsComponent],
  exports: [
    PaymentsComponent
  ]
})
export class PaymentsModule { }
