import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddressComponent } from '../../address/address.component';
import { MultiSelectModule } from '../../ui/multi-select/multi-select.module';
import { MakeOfferComponent } from './make-offer/make-offer.component';
import { ProposalComponent } from './proposal.component';


const routes: Routes = [
  { path: '', component: ProposalComponent },
  { path: 'address', component: AddressComponent },
  { path: 'offer', component: MakeOfferComponent }
];

@NgModule({
  declarations: [
    ProposalComponent,
    AddressComponent,
    MakeOfferComponent,
  ],
  imports: [
    MultiSelectModule,
    SharedModule,
    RouterModule.forChild(routes), // Importante: Use forChild() aqui


  ],
  exports: [
    // ProposalComponent,
    // MakeOfferComponent
  ]
})
export class ProposalModule { }
