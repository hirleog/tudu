import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppHomeComponent } from './app-home/app-home.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { CardDetailComponent } from './card-detail/card-detail.component';

const routes: Routes = [
  // { path: '', component: AppMenuComponent },
  { path: '', component: AppHomeComponent },
  { path: 'budgets', component: BudgetsComponent },
  { path: 'detail', component: CardDetailComponent }
];

@NgModule({
  declarations: [
    AppHomeComponent,
    // AppMenuComponent,
    BudgetsComponent,
    CardDetailComponent,


  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class MainAppModule { }
