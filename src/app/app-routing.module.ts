import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { ClientReviewsComponent } from './components/client-reviews/client-reviews.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProposalComponent } from './components/proposal-flow/proposal/proposal.component';

const routes: Routes = [
  // { path: '', component: HeroComponent },
  { path: '', component: HomeComponent },
  { path: 'proposal', component: ProposalComponent },
  { path: 'about', component: AboutComponent },
  { path: 'reviews', component: ClientReviewsComponent },

  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
