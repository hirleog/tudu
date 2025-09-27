import { Component, HostListener, OnInit } from '@angular/core';
import { GoogleReviewsService } from 'src/app/services/google-reviews.service';

@Component({
  selector: 'app-client-reviews',
  templateUrl: './client-reviews.component.html',
  styleUrls: ['./client-reviews.component.css'],
})
export class ClientReviewsComponent implements OnInit {
  reviews: any[] = [];
  isLoading = true; // Indica carregamento
  errorMessage: string | null = null; // Para erros

  feedbacks = [
    {
      text: 'Ótimo trabalho, ótimo atendimento. O trabalho no meu carro foi muito bom. Se tá procurando qualidade, esse é  o lugar.',
      client: 'Thiago Martins Febraro',
      photoUrl: '../../../assets/reviews1.webp', // URL da foto
      rating: 5,
    },
    {
      text: 'Trabalho impecável, excelente profissional, preço justo e ótimo atendimento!!',
      client: 'Carlos Jr',
      photoUrl: '../../../assets/reviews2.webp', // URL da foto
      rating: 5,
    },
    {
      text: 'Profissional excelente, detalhista, ótimo preço, me senti em casa com tamanho conforto e segurança que me passou.',
      client: 'Gabriel_diogo',
      photoUrl: '../../../assets/reviews3.webp', // URL da foto
      rating: 5,
    },
    {
      text: 'Excelente profissional, detalhista e cuidadoso, reviveu a pintura do meu carro.',
      client: 'dd fachinelli',
      photoUrl: '../../../assets/reviews4.webp', // URL da foto
      rating: 5,
    },
    {
      text: 'Excelente profissional, preço justo e muita qualidade!!’',
      client: 'Enzo Henrique Cavalieri Simensato',
      photoUrl: '../../../assets/reviews5.webp', // URL da foto
      rating: 5,
    },
    {
      text: 'Confiável, trabalho e atendimento de excelência!',
      client: 'Pedro Henrique',
      photoUrl: '../../../assets/reviews6.webp', // URL da foto
      rating: 5,
    },
    {
      text: '',
      client: 'Sidney Ferreira',
      photoUrl: '../../../assets/reviews7.webp', // URL da foto
      rating: 5,
    },
  ];

  feedbackGroups: any[][] = [];
  groupSize = 3; // Padrão: 3 feedbacks por grupo

  constructor(private googleReviewsService: GoogleReviewsService) {}

  ngOnInit(): void {
    this.updateGroupSize();
    this.createFeedbackGroups();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.updateGroupSize();
    this.createFeedbackGroups();
  }

  updateGroupSize(): void {
    const width = window.innerWidth;

    if (width < 992) {
      this.groupSize = 2; // 2 feedbacks por grupo em telas médias (< 992px)
    } else {
      this.groupSize = 3; // 3 feedbacks por grupo em telas grandes (>= 992px)
    }
  }

  createFeedbackGroups(): void {
    this.feedbackGroups = []; // Limpa os grupos antigos
    for (let i = 0; i < this.feedbacks.length; i += this.groupSize) {
      this.feedbackGroups.push(this.feedbacks.slice(i, i + this.groupSize));
    }
  }
  // Função para gerar as estrelas
  getStars(rating: number) {
    return new Array(rating).fill(0); // Retorna um array de tamanho 'rating' para as estrelas
  }

  public getGoogleReviews(): void {
    // Faz a chamada para buscar as avaliações
    this.googleReviewsService.getReviews().subscribe({
      next: (response: any) => {
        this.reviews = response.result.reviews || [];
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage =
          'Erro ao carregar as avaliações. Tente novamente mais tarde.';
        this.isLoading = false;
        console.error(error);
      },
    });
  }
}
