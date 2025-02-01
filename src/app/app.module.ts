import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AboutComponent } from './components/about/about.component';
import { HeroComponent } from './components/hero/hero.component';

import { HttpClientModule } from '@angular/common/http'; // Importa o módulo
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientReviewsComponent } from './components/client-reviews/client-reviews.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { NavComponent } from './components/nav/nav.component';
import { ServicesComponent } from './components/services/services.component';
import { ProposalComponent } from './components/proposal-flow/proposal/proposal.component';
import { MultiSelectComponent } from './components/ui/multi-select/multi-select.component';
import { AddressComponent } from './components/address/address.component';
import { MakeOfferComponent } from './components/proposal-flow/make-offer/make-offer.component';
import { CurrencyFormatDirective } from './directives/currency-format.directive';
import { AppHomeComponent } from './components/main/app-home/app-home.component';
import { AppMenuComponent } from './components/main/app-menu/app-menu.component';
import { ShowcaseComponent } from './components/showcase/showcase.component';

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
    ShowcaseComponent,
    ProposalComponent,
    MultiSelectComponent,
    AddressComponent,
    MakeOfferComponent,
    CurrencyFormatDirective,
    AppHomeComponent,
    AppMenuComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
