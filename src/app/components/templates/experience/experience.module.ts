import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceComponent } from './experience.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ExperienceComponent],
  imports: [CommonModule, SharedModule],
  exports: [ExperienceComponent],
})
export class ExperienceModule {}
