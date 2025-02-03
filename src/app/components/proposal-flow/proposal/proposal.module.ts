import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MultiSelectModule } from '../../ui/multi-select/multi-select.module';
import { MakeOfferComponent } from './make-offer/make-offer.component';
import { ProposalComponent } from './proposal.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: 'proposal', component: ProposalComponent },
  { path: 'offer', component: MakeOfferComponent }
];

@NgModule({
  declarations: [
    ProposalComponent,
    MakeOfferComponent
  ],
  imports: [
    // ProposalRoutingModule,
    // CommonModule,
    MultiSelectModule,
    SharedModule,
    RouterModule.forChild(routes), // Importante: Use forChild() aqui


  ],
  exports: [
    ProposalComponent,
    MakeOfferComponent
  ]
})
export class ProposalModule { }
