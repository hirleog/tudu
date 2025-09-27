import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeroComponent } from '../hero/hero.component';
import { ShowcaseComponent } from './showcase.component';
import { CarouselComponent } from './carousel/carousel.component';
import { HighlightsComponent } from './highlights/highlights.component';
import { GoogleReviewsService } from 'src/app/services/google-reviews.service';
import { FooterComponent } from '../footer/footer.component';
import { ClientReviewsComponent } from './client-reviews/client-reviews.component';
import { MidBannerComponent } from './mid-banner/mid-banner.component';

const routes: Routes = [{ path: '', component: ShowcaseComponent }];
@NgModule({
  declarations: [
    ShowcaseComponent,
    HeroComponent,
    CarouselComponent,
    HighlightsComponent,
    ClientReviewsComponent,
    MidBannerComponent,
    FooterComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [
    // ShowcaseComponent
  ],
  providers: [GoogleReviewsService],
})
export class ShowcaseModule {}
