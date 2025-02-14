import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentsModule } from '../payments/payments.module';
import { AppHomeComponent } from './app-home/app-home.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { InProgressComponent } from './in-progress/in-progress.component';

const routes: Routes = [
  // { path: '', component: AppMenuComponent },
  { path: '', component: AppHomeComponent },
  { path: 'budgets', component: BudgetsComponent },
  { path: 'progress', component: InProgressComponent },
  { path: 'detail', component: CardDetailComponent },
];

@NgModule({
  declarations: [
    AppHomeComponent,
    BudgetsComponent,
    CardDetailComponent,
    InProgressComponent
  ],
  imports: [
    SharedModule,
    PaymentsModule,
    RouterModule.forChild(routes)
  ]
})
export class MainAppModule { }
