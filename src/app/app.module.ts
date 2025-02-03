import { NgModule } from '@angular/core';
import { AboutComponent } from './components/about/about.component';
import { HeroComponent } from './components/hero/hero.component';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddressComponent } from './components/address/address.component';
import { ClientReviewsComponent } from './components/client-reviews/client-reviews.component';
import { FooterComponent } from './components/footer/footer.component';
import { AppMenuComponent } from './components/main/app-menu/app-menu.component';
import { NavComponent } from './components/nav/nav.component';
import { ServicesComponent } from './components/services/services.component';
import { CurrencyFormatDirective } from './directives/currency-format.directive';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AboutComponent,
    // HeroComponent,
    ServicesComponent,
    FooterComponent,
    ClientReviewsComponent,
    // LoginComponent,
    // ShowcaseComponent,
    // ProposalComponent,
    // MultiSelectComponent,
    // AddressComponent,
    // MakeOfferComponent,
    CurrencyFormatDirective,
    // AppHomeComponent,
    AppMenuComponent,
    // CardDetailComponent,
    // BudgetsComponent,
  ],
  imports: [

    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
