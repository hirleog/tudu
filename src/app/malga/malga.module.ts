// src/app/malga/malga.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MalgaService } from './service/malga.service';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [MalgaService],
})
export class MalgaModule { }