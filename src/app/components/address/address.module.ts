import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AddressComponent } from './address.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{ path: 'address', component: AddressComponent }];

@NgModule({
  declarations: [AddressComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [AddressComponent],
})
export class AddressModule {}
