import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavModule } from '../components/nav/nav.module';
import { CurrencyFormatDirective } from '../directives/currency-format.directive';
import { CustomModalComponent } from './custom-modal/custom-modal.component';

@NgModule({
  declarations: [CurrencyFormatDirective, CustomModalComponent],
  imports: [
    // CommonModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavModule,
    CurrencyFormatDirective,
    CustomModalComponent,
    // StatusFilterPipe,
  ],
})
export class SharedModule {}
