import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientReviewsComponent } from './components/client-reviews/client-reviews.component';
import { FooterComponent } from './components/footer/footer.component';
import { AppMenuComponent } from './components/main/app-menu/app-menu.component';
import { ServicesComponent } from './components/services/services.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    ServicesComponent,
    FooterComponent,
    ClientReviewsComponent,
    AppMenuComponent,
  ],
  imports: [

    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
