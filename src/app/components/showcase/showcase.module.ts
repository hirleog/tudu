import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeroComponent } from '../hero/hero.component';
import { ShowcaseComponent } from './showcase.component';
import { CarouselComponent } from './carousel/carousel.component';
import { HighlightsComponent } from './highlights/highlights.component';

const routes: Routes = [{ path: '', component: ShowcaseComponent }];
@NgModule({
  declarations: [ShowcaseComponent, HeroComponent, CarouselComponent, HighlightsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    // ShowcaseComponent
  ],
})
export class ShowcaseModule {}
