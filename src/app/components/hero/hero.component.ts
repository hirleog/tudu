import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
interface HeroSlide {
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent implements OnInit {
  currentSlide = -1;
  private intervalId: any;

  slides: HeroSlide[] = [
    {
      image: '../../../assets/eeeE107B6H4.webp',
      badge: 'App Tudü',
      title: 'Um app, muitos serviços.',
      subtitle:
        'Conectamos você aos melhores profissionais para sua casa ou empresa.',
      buttonText: 'Ver serviços disponíveis',
    },
    {
      image: '../../../assets/ex1.webp',
      badge: 'Profissionais',
      title: 'Ganhe dinheiro com suas habilidades.',
      subtitle: 'Seja um parceiro Tudü e aumente sua carteira de clientes.',
      buttonText: 'Saiba mais',
    },
  ];
  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.currentSlide = 0;
      this.startAutoPlay();
    }, 50);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  startAutoPlay() {
    // Limpa qualquer intervalo existente antes de criar um novo
    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    const next = (this.currentSlide + 1) % this.slides.length;

    // Se o próximo slide for o primeiro (0), resetamos tudo momentaneamente
    if (next === 0) {
      this.currentSlide = -1;
      setTimeout(() => {
        this.currentSlide = 0;
      }, 10);
    } else {
      this.currentSlide = next;
    }
  }

  setSlide(index: number) {
    clearInterval(this.intervalId);
    this.currentSlide = -1;

    setTimeout(() => {
      this.currentSlide = index;
      this.startAutoPlay();
    }, 10);
  }
  scrollToServices() {
    const element = document.getElementById('hero'); // Ou o ID da sua seção de serviços
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }
}
