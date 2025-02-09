import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavModule } from '../components/nav/nav.module';



@NgModule({
  declarations: [

  ],
  imports: [
    // CommonModule,
  ],
  exports: [
    // BrowserModule,
    // BrowserAnimationsModule,
    // HttpClientModule,
    // BrowserAnimationsModule
    // AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavModule
  ]
})
export class SharedModule { }
