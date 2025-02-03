import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { AppHomeComponent } from './app-home/app-home.component';
import { AppMenuComponent } from './app-menu/app-menu.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { CardDetailComponent } from './card-detail/card-detail.component';


@NgModule({
  declarations: [
    // AppHomeComponent,
    // AppMenuComponent,
    // BudgetsComponent,
    // CardDetailComponent,

  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class MainModule { }
