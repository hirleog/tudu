import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavModule } from '../components/nav/nav.module';
import { CurrencyFormatDirective } from '../directives/currency-format.directive';
import { CustomModalModule } from 'src/app/shared/custom-modal/custom-modal.module';
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
    NavModule,
    CurrencyFormatDirective,
    CustomModalModule,
    // StatusFilterPipe,
  ],
  providers: [GoogleReviewsService],
})
export class SharedModule {}
