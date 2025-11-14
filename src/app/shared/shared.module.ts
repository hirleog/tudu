import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomModalModule } from 'src/app/shared/custom-modal/custom-modal.module';
import { TuduComponentsModule } from 'tudu-components';
import { CurrencyFormatDirective } from '../directives/currency-format.directive';
import { GoogleReviewsService } from '../services/google-reviews.service';

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
    CurrencyFormatDirective,
    CustomModalModule,
    TuduComponentsModule,
    // StatusFilterPipe,
  ],
  providers: [GoogleReviewsService],
})
export class SharedModule {}
