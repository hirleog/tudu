import { loadRemoteModule } from '@angular-architects/module-federation';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthGuard } from './guards/auth.guard';

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
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/user-login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'proposal',
    // canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/proposal-flow/proposal/proposal.module').then(
        (m) => m.ProposalModule
      ),
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/main/main-app.module').then((m) => m.MainAppModule),
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/main/profile/profile.module').then(
        (m) => m.ProfileModule
      ),
  },
  {
    path: 'tudu-professional',
    canActivate: [AuthGuard],
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${environment.mfeUrl}/remoteEntry.js`,
        remoteName: 'mfeApp',
        exposedModule: './TuduProfessionalModule',
      })
        .then((m) => m.TuduProfessionalModule)
        .catch((err) => console.error('Error loading remote module', err)),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
