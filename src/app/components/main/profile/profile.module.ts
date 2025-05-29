import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileComponent } from './profile.component';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';
import { FinancialComponent } from '../../financial/financial.component';

const routes: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'profile-detail', component: ProfileDetailComponent },
  { path: 'financial', component: FinancialComponent },
];

@NgModule({
  declarations: [ProfileComponent, ProfileDetailComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  exports: [ProfileComponent, ProfileDetailComponent],
  providers: [],
})
export class ProfileModule {}
