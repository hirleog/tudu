import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-skeleton',
  templateUrl: './card-skeleton.component.html',
})
export class CardSkeletonComponent {
  @Input() isOffer: boolean = false;
}
