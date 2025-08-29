import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css'],
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Input() maxStars: number = 5;
  @Input() starSize: string = 'w-4 h-4';
  @Input() showNumber: boolean = true;
  @Input() editable: boolean = false;
  @Output() ratingChange = new EventEmitter<number>();

  get stars(): number[] {
    return Array(this.maxStars)
      .fill(0)
      .map((_, i) => i);
  }

  setRating(newRating: number): void {
    if (this.editable) {
      this.rating = newRating;
      this.ratingChange.emit(this.rating);
    }
  }

  isFullStar(starIndex: number): boolean {
    return starIndex < Math.floor(this.rating);
  }

  isHalfStar(starIndex: number): boolean {
    const decimalPart = this.rating % 1;
    return (
      starIndex === Math.floor(this.rating) &&
      decimalPart >= 0.3 &&
      decimalPart <= 0.7
    );
  }

  isEmptyStar(starIndex: number): boolean {
    return starIndex >= Math.ceil(this.rating);
  }

  // Método alternativo mais preciso para meia estrela
  shouldShowHalfStar(starIndex: number): boolean {
    const fullStars = Math.floor(this.rating);
    const decimal = this.rating - fullStars;

    // Mostra meia estrela se for a próxima após as cheias e tiver decimal > 0
    return starIndex === fullStars && decimal > 0;
  }

  // Método alternativo para mostrar estrela cheia ou vazia parcial
  getStarFillPercentage(starIndex: number): number {
    if (this.rating >= starIndex + 1) return 100; // Estrela cheia
    if (this.rating <= starIndex) return 0; // Estrela vazia

    // Estrela parcialmente preenchida
    return (this.rating - starIndex) * 100;
  }
}
