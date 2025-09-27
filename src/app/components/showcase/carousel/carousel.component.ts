import { Component, Input, OnInit, OnDestroy } from '@angular/core';

interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent implements OnInit, OnDestroy {
  @Input() darkMode = false;

  slides: Slide[] = [
    {
      id: 1,
      title: 'Serviços Premium',
      description: 'Conheça nossos serviços exclusivos',
      image: 'assets/eeeE107B6H4.webp',
    },
    {
      id: 2,
      title: 'Promoções',
      description: 'Ofertas especiais para você',
      image: 'assets/ex1.webp',
    },
    {
      id: 3,
      title: 'Novidades',
      description: 'Confira nossos lançamentos',
      image: 'assets/ex2.webp',
    },
  ];

  currentSlide = 0;
  private intervalId: any;

  ngOnInit() {
    this.startCarousel();
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  startCarousel() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopCarousel() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}
