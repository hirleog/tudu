import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { path: 'login', component: LoginComponent },
  // // {
  // //   path: 'offer',
  // //   loadComponent: () => import('./components/proposal-flow/proposal/make-offer/make-offer.component').then(m => m.MakeOfferComponent)
  // // },

  // {
  //   path: 'card-detail',
  //   loadComponent: () => import('./components/main/card-detail/card-detail.component').then(m => m.CardDetailComponent)
  // },
  // {
  //   path: 'budgets',
  //   loadComponent: () => import('./components/main/budgets/budgets.component').then(m => m.BudgetsComponent)
  // },

  // {
  //   path: 'address',
  //   loadComponent: () => import('./components/address/address.component').then(m => m.AddressComponent)
  // },


  { path: '', loadChildren: () => import('./components/showcase/showcase.module').then(m => m.ShowcaseModule) },

  // {
  //   path: 'login',
  //   loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule)
  // },
  // {
  //   path: 'proposal',
  //   loadChildren: () => import('./components/proposal-flow/proposal/proposal.module').then(m => m.ProposalModule)
  // },
  // { path: 'proposal-flow', loadChildren: () => import('./components/proposal-flow/proposal/proposal.module').then(m => m.ProposalFlowModule) },

  //   { path: '', component: AppHomeComponent },
  //   { path: 'showcase', loadComponent: () => import('./components/showcase/showcase.component').then(m => m.ShowcaseComponent) } // Página inicial
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
