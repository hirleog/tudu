import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMenuModule } from '../main/app-menu/app-menu.module';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AppMenuModule],
  declarations: [NavComponent],
  exports: [NavComponent],
})
export class NavModule {}
