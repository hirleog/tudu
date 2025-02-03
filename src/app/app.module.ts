import { NgModule } from '@angular/core';
import { AboutComponent } from './components/about/about.component';
import { HeroComponent } from './components/hero/hero.component';

import { AppComponent } from './app.component';
import { AddressComponent } from './components/address/address.component';
import { ClientReviewsComponent } from './components/client-reviews/client-reviews.component';
import { FooterComponent } from './components/footer/footer.component';
import { AppMenuComponent } from './components/main/app-menu/app-menu.component';
import { NavComponent } from './components/nav/nav.component';
import { ProposalModule } from './components/proposal-flow/proposal/proposal.module';
import { ServicesComponent } from './components/services/services.component';
import { ShowcaseModule } from './components/showcase/showcase.module';
import { CurrencyFormatDirective } from './directives/currency-format.directive';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AboutComponent,
    HeroComponent,
    ServicesComponent,
    FooterComponent,
    ClientReviewsComponent,
    // LoginComponent,
    // ShowcaseComponent,
    // ProposalComponent,
    // MultiSelectComponent,
    AddressComponent,
    // MakeOfferComponent,
    CurrencyFormatDirective,
    // AppHomeComponent,
    AppMenuComponent,
    // CardDetailComponent,
    // BudgetsComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,

    // ShowcaseModule,
    // ProposalModule,
    // MainModule,
    // MultiSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
