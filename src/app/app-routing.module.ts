import { loadRemoteModule } from '@angular-architects/module-federation';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/main/profile/profile.component';
const environment = require('./environments/environment');

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
  {
    path: '',
    loadChildren: () =>
      import('./components/showcase/showcase.module').then(
        (m) => m.ShowcaseModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./components/user-login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'proposal',
    loadChildren: () =>
      import('./components/proposal-flow/proposal/proposal.module').then(
        (m) => m.ProposalModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./components/main/main-app.module').then((m) => m.MainAppModule),
  },
  {
    path: 'tudu-professional',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${environment.mfeUrl}/remoteEntry.js`,
        remoteName: 'mfeApp',
        exposedModule: './MainAppModule',
      })
        .then((m) => m.MainAppModule)
        .catch((err) => console.error('Error loading remote module', err)),
  },
  {
    path: 'tudu-professional/profile',
    component: ProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
