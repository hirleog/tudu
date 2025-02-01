import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { ClientReviewsComponent } from './components/client-reviews/client-reviews.component';
import { LoginComponent } from './components/login/login.component';
import { ProposalComponent } from './components/proposal-flow/proposal/proposal.component';
import { AddressComponent } from './components/address/address.component';
import { MakeOfferComponent } from './components/proposal-flow/make-offer/make-offer.component';
import { AppHomeComponent } from './components/main/app-home/app-home.component';
import { ShowcaseComponent } from './components/showcase/showcase.component';
import { CardDetailComponent } from './components/main/card-detail/card-detail.component';

const routes: Routes = [
  // { path: '', component: HeroComponent },
  { path: 'showcase', component: ShowcaseComponent },
  { path: 'proposal', component: ProposalComponent },
  { path: 'offer', component: MakeOfferComponent },
  
  // { path: 'app-home', component: AppHomeComponent },
  { path: '', component: AppHomeComponent },
  { path: 'card-detail', component: CardDetailComponent },


  { path: 'address', component: AddressComponent },
  { path: 'login', component: LoginComponent },
  // { path: 'about', component: AboutComponent },
  // { path: 'reviews', component: ClientReviewsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
