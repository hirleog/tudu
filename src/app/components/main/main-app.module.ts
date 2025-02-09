import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppHomeComponent } from './app-home/app-home.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { NavComponent } from '../nav/nav.component';
import { PaymentsComponent } from '../payments/payments.component';
import { PaymentsModule } from '../payments/payments.module';

const routes: Routes = [
  // { path: '', component: AppMenuComponent },
  { path: '', component: AppHomeComponent },
  { path: 'budgets', component: BudgetsComponent },
  { path: 'detail', component: CardDetailComponent }
];

@NgModule({
  declarations: [
    // NavComponent,
    AppHomeComponent,
    // AppMenuComponent,
    BudgetsComponent,
    CardDetailComponent,

  ],
  imports: [
    SharedModule,
    PaymentsModule,
    RouterModule.forChild(routes)
  ]
})
export class MainAppModule { }
