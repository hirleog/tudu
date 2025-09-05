import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsComponent } from './payments.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeviceService } from 'src/app/services/device/service/device.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [PaymentsComponent],
  exports: [PaymentsComponent],
  providers: [DeviceService],
})
export class PaymentsModule {}
