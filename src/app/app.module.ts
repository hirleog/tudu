import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientReviewsComponent } from './components/client-reviews/client-reviews.component';
import { FooterComponent } from './components/footer/footer.component';
import { AppMenuComponent } from './components/main/app-menu/app-menu.component';
import { ServicesComponent } from './components/services/services.component';
import { SignUpComponent } from './components/user-login/sign-up/sign-up.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SharedModule } from './shared/shared.module';
import { ModalComponent } from './components/modal/modal.component';
import { FinancialComponent } from './components/financial/financial.component';

@NgModule({
  declarations: [
    AppComponent,
    ServicesComponent,
    FooterComponent,
    ClientReviewsComponent,
    AppMenuComponent,
    SignUpComponent,
    ModalComponent,
    FinancialComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true, // Permite múltiplos interceptores
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Adicione o CUSTOM_ELEMENTS_SCHEMA aqui
})
export class AppModule {}
