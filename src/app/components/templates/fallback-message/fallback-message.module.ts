import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FallbackMessageComponent } from './fallback-message.component';

@NgModule({
  declarations: [FallbackMessageComponent],
  imports: [CommonModule],
  exports: [FallbackMessageComponent],
})
export class FallbackMessageModule {}
