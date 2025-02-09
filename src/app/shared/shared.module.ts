import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavModule } from '../components/nav/nav.module';
import { CurrencyFormatDirective } from '../directives/currency-format.directive';



@NgModule({
  declarations: [
    // CurrencyFormatDirective
  ],
  imports: [
    // CommonModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavModule
  ]
})
export class SharedModule { }
