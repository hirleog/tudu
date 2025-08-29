import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';
import { ProfileComponent } from './profile.component';
import { StarRatingModule } from '../../templates/star-rating/star-rating.module';

const routes: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'profile-detail', component: ProfileDetailComponent },
];

@NgModule({
  declarations: [ProfileComponent, ProfileDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    StarRatingModule,
  ],
  exports: [ProfileComponent, ProfileDetailComponent],
  providers: [],
})
export class ProfileModule {}
