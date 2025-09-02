import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from './login/login.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'password-reset', component: PasswordResetComponent },
];
@NgModule({
  declarations: [LoginComponent, PasswordResetComponent],
  imports: [
    // CommonModule,
    // FormsModule,
    // ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    // LoginComponent
  ],
})
export class LoginModule {}
