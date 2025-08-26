import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavModule } from '../components/nav/nav.module';
import { CurrencyFormatDirective } from '../directives/currency-format.directive';
import { CustomModalComponent } from './custom-modal/custom-modal.component';
import { CustomModalModule } from './custom-modal/custom-modal.module';

@NgModule({
  declarations: [CurrencyFormatDirective],
  imports: [
    // CommonModule,
    CustomModalModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavModule,
    CurrencyFormatDirective,
    // StatusFilterPipe,
  ],
})
export class SharedModule {}
