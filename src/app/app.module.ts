import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AboutComponent } from './components/about/about.component';
import { HeroComponent } from './components/hero/hero.component';

import { HttpClientModule } from '@angular/common/http'; // Importa o módulo
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientReviewsComponent } from './components/client-reviews/client-reviews.component';
import { ServicesComponent } from './components/services/services.component';
import { FooterComponent } from './template/footer/footer.component';
import { NavComponent } from './template/nav/nav.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AboutComponent,
    HeroComponent,
    ServicesComponent,
    FooterComponent,
    ClientReviewsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
