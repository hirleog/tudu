import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-flow-end',
  templateUrl: './flow-end.component.html',
  styleUrls: ['./flow-end.component.css'],
})
export class FlowEndComponent {
  rating: number = 0;
  preview: number = 0;
  stars: number[] = [1, 2, 3, 4, 5];

  constructor(private router: Router) {}

  setRating(value: number) {
    this.rating = value;
  }

  previewRating(value: number) {
    this.preview = value;
  }

  resetPreview() {
    this.preview = 0;
  }

  solicitarOutroServico() {
    if (this.rating === 0) {
      const modalElement = document.getElementById('alertModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    } else {
      this.router.navigate(['/']);
    }
  }
}
