import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressComponent } from './address.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavModule } from '../nav/nav.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: 'address', component: AddressComponent }];

@NgModule({
  declarations: [AddressComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavModule,
    RouterModule.forChild(routes),
  ],
  exports: [AddressComponent],
})
export class AddressModule {}
