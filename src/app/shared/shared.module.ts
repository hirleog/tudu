import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavModule } from '../components/nav/nav.module';
import { CurrencyFormatDirective } from '../directives/currency-format.directive';
import { StatusFilterPipe } from '../components/helpers/status-filter.pipe';

@NgModule({
  declarations: [CurrencyFormatDirective, StatusFilterPipe],
  imports: [
    // CommonModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavModule,
    CurrencyFormatDirective,
    StatusFilterPipe,
  ],
})
export class SharedModule {}
