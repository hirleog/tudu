import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
    path: 'mfe',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: 'http://localhost:4201/remoteEntry.js', // URL do remoteEntry do MFE
        remoteName: 'tuduProfessional', // Nome do MFE (definido no webpack.config.js do MFE)
        exposedModule: './BudgetsModule', // Nome do módulo exposto pelo MFE
      }).then((m) => m.BudgetsModule), // Nome da classe do módulo
  },
  // {
  //   path: 'prestador',
  //   loadChildren: () =>
  //     import('mfe/Module').then((m) => m.PrestadorModule),
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
