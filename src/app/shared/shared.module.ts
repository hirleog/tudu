import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../components/ui/multi-select/multi-select.component';



@NgModule({
  // declarations: [

  // ],
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
  ]
})
export class SharedModule { }
