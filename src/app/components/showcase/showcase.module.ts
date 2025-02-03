import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeroComponent } from '../hero/hero.component';
import { ShowcaseComponent } from './showcase.component';

const routes: Routes = [
  { path: '', component: ShowcaseComponent },
];
@NgModule({
  declarations: [
    ShowcaseComponent,
    HeroComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes), // Importante: Use forChild() aqui
  ],
  exports: [
    // ShowcaseComponent
  ]
})
export class ShowcaseModule { }
