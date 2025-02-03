import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// AppRoutingModule
// |
// |- path: ''
// |  |- ShowcaseModule
// |
// |- path: 'login'
// |  |- LoginModule
// |
// |- path: 'proposal'
// |  |- ProposalModule
// |     |
// |     |- path: ''
// |     |  |- ProposalComponent
// |     |
// |     |- path: 'address'
// |     |  |- AddressComponent
// |     |
// |     |- path: 'offer'
// |        |- MakeOfferComponent
// |
// |- path: 'home'
// |  |- MainAppModule
// |     |
// |     |- path: 'budgets'
// |     |  |- BudgetsComponent
// |     |
// |     |- path: 'detail'
// |        |- DetailComponent


const routes: Routes = [

  { path: '', loadChildren: () => import('./components/showcase/showcase.module').then(m => m.ShowcaseModule) },
  { path: 'login', loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule) },
  { path: 'proposal', loadChildren: () => import('./components/proposal-flow/proposal/proposal.module').then(m => m.ProposalModule) },
  { path: 'home', loadChildren: () => import('./components/main/main-app.module').then(m => m.MainAppModule) },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
