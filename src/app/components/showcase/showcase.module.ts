import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShowcaseComponent } from './showcase.component';

const routes: Routes = [
  { path: '', component: ShowcaseComponent }

];
@NgModule({
  declarations: [
    ShowcaseComponent
  ],
  imports: [
    // CommonModule,
    // ShowcaseRoutingModule,
    SharedModule,
    RouterModule.forChild(routes), // Importante: Use forChild() aqui

  ],
  exports: [
    // ShowcaseComponent
  ]
})
export class ShowcaseModule { }
