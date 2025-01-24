import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AboutComponent } from './components/about/about.component';
import { HeroComponent } from './components/hero/hero.component';

import { HttpClientModule } from '@angular/common/http'; // Importa o módulo
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientReviewsComponent } from './components/client-reviews/client-reviews.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavComponent } from './components/nav/nav.component';
import { ServicesComponent } from './components/services/services.component';
import { ProposalComponent } from './components/proposal-flow/proposal/proposal.component';
import { MultiSelectComponent } from './components/ui/multi-select/multi-select.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AboutComponent,
    HeroComponent,
    ServicesComponent,
    FooterComponent,
    ClientReviewsComponent,
    LoginComponent,
    HomeComponent,
    ProposalComponent,
    MultiSelectComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
