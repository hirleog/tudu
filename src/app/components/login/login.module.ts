import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from './login.component';

const routes: Routes = [
  { path: '', component: LoginComponent }

];
@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    // CommonModule,
    // FormsModule,
    // ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    // LoginComponent
  ]
})
export class LoginModule { }
