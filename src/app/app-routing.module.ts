import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TuduProfessionalComponent } from './external-components/tudu-professional/tudu-professional.component';
import { loadRemoteModule } from '@angular-architects/module-federation';

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
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        remoteName: 'mfeApp',
        exposedModule: './MainAppModule',
      })
        .then((m) => m.MainAppModule)
        .catch((err) => console.error('Error loading remote module', err)),
  },
  // path: 'tudu-professional',
  // loadChildren: () =>
  //   loadRemoteModule({
  //     remoteEntry: 'http://localhost:4201/remoteEntry.js',
  //     remoteName: 'tuduProfessional',
  //     exposedModule: './MainAppModule',
  //   })
  //     .then((m) => m.MainAppModule)
  //     .catch((err) => console.error('Error loading remote module', err)),
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
