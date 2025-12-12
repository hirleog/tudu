import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationViewComponent } from './notification-view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NotificationViewComponent],
  imports: [CommonModule, SharedModule, RouterModule],
  exports: [NotificationViewComponent],
})
export class NotificationViewModule {}
