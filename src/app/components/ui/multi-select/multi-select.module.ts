import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MultiSelectComponent } from './multi-select.component';



@NgModule({
  declarations: [
    MultiSelectComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    MultiSelectComponent
  ]
})
export class MultiSelectModule { }
