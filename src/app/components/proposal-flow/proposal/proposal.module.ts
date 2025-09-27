import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddressModule } from '../../address/address.module';
import { CalendarModule } from '../../calendar/calendar.module';
import { CategoryFilterComponent } from '../../category-filter/category-filter.component';
import { PaymentsModule } from '../../payments/payments.module';
import { MultiSelectModule } from '../../ui/multi-select/multi-select.module';
import { MakeOfferComponent } from './make-offer/make-offer.component';
import { ProposalComponent } from './proposal.component';
import { CardSkeletonModule } from '../../templates/card-skeleton/card-skeleton.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { PriceDisplayComponent } from '../../price-display/price-display.component';

const routes: Routes = [
  { path: '', component: ProposalComponent },
  { path: 'offer', component: MakeOfferComponent },
  { path: 'categories', component: MakeOfferComponent },
];

@NgModule({
  declarations: [
    ProposalComponent,
    MakeOfferComponent,
    CategoryFilterComponent,
    PriceDisplayComponent,
  ],
  imports: [
    MultiSelectModule,
    SharedModule,
    CalendarModule,
    AddressModule,
    PaymentsModule,
    CardSkeletonModule,
    NgxCurrencyModule,

    RouterModule.forChild(routes), // Importante: Use forChild() aqui
  ],
  exports: [
    // ProposalComponent,
    // MakeOfferComponent
  ],
})
export class ProposalModule {}
