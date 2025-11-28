import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationViewComponent } from './notification-view.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [NotificationViewComponent],
  imports: [CommonModule, SharedModule],
  exports: [NotificationViewComponent],
})
export class NotificationViewModule {}
