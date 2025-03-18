import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfessionalComponent } from './professional.component';
import { MainAppModule } from '../components/main/main-app.module';

const routes: Routes = [
  { path: '', component: ProfessionalComponent }, // Rota padrão
];

@NgModule({
  imports: [MainAppModule, RouterModule.forChild(routes)], // Use forChild para módulos de funcionalidade
  exports: [RouterModule],
})
export class ProfessionalRoutingModule {}
