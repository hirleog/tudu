import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddressComponent } from '../../address/address.component';
import { MultiSelectModule } from '../../ui/multi-select/multi-select.module';
import { MakeOfferComponent } from './make-offer/make-offer.component';
import { ProposalComponent } from './proposal.component';
import { CategoryFilterComponent } from '../../category-filter/category-filter.component';
import { CalendarComponent } from '../../calendar/calendar.component';
import { CalendarModule } from '../../calendar/calendar.module';
import { AddressModule } from '../../address/address.module';

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
  ],
  imports: [
    MultiSelectModule,
    SharedModule,
    CalendarModule,
    AddressModule,
    RouterModule.forChild(routes), // Importante: Use forChild() aqui
  ],
  exports: [
    // ProposalComponent,
    // MakeOfferComponent
  ],
})
export class ProposalModule {}
