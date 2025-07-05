import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMenuComponent } from './app-menu.component';

@NgModule({
  declarations: [AppMenuComponent],
  exports: [AppMenuComponent],
  imports: [CommonModule],
})
export class AppMenuModule {}
