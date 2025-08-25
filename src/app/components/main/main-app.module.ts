import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddressModule } from '../address/address.module';
import { CalendarModule } from '../calendar/calendar.module';
import { FormatDateTimePipe } from '../helpers/format-date-time.pipe';
import { PaymentsModule } from '../payments/payments.module';
import { CardSkeletonModule } from '../templates/card-skeleton/card-skeleton.module';
import { AppHomeComponent } from './app-home/app-home.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { FlowEndComponent } from './flow-end/flow-end.component';
import { ProgressDetailComponent } from './progress-detail/progress-detail.component';
import { ProgressComponent } from './progress/progress.component';
import { OrderHelpComponent } from './order-help/order-help.component';

const routes: Routes = [
  // { path: '', component: AppMenuComponent },
  { path: '', component: AppHomeComponent },
  { path: 'budgets', component: BudgetsComponent },
  { path: 'progress', component: ProgressComponent },
  { path: 'progress-detail', component: ProgressDetailComponent },
  { path: 'detail', component: CardDetailComponent },
  { path: 'order-help', component: OrderHelpComponent },

  // { path: 'profile', component: ProfileComponent },
  // { path: 'profile-detail', component: ProfileDetailComponent },

  { path: 'end', component: FlowEndComponent },
];

@NgModule({
  declarations: [
    AppHomeComponent,
    BudgetsComponent,
    CardDetailComponent,
    ProgressComponent,
    ProgressDetailComponent,
    FlowEndComponent,
    // ProfileComponent,
    // ProfileDetailComponent,

    FormatDateTimePipe,
  ],
  imports: [
    SharedModule,
    PaymentsModule,
    CalendarModule,
    AddressModule,
    CardSkeletonModule,
    RouterModule.forChild(routes),
  ],
  exports: [FormatDateTimePipe],
})
export class MainAppModule {}
