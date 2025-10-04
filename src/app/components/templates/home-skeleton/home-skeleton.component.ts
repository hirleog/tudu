import { Component } from '@angular/core';

@Component({
  selector: 'app-home-skeleton',
  templateUrl: './home-skeleton.component.html',
  styleUrls: ['./home-skeleton.component.css'],
})
export class HomeSkeletonComponent {
  // Array para o ngFor dos cards de serviço
  skeletonItems = Array(6).fill(0);
}
