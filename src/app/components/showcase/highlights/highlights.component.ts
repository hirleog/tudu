import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { card } from 'src/app/interfaces/card';
import { CardService } from 'src/app/services/card.service';

interface Highlight {
  categoria: string;
  total: number;
}

@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.component.html',
  styleUrls: ['./highlights.component.css'],
})
export class HighlightsComponent implements OnInit {
  @Input() darkMode = false;

  public cardsMock: card[] = [
    {
      id: 1,
      icon: 'fas fa-tools',
      cardDetail: {
        label: 'Reparos e Manutenção',
        value: 'reparos',
      },
      disabled: false,
    },
    {
      id: 2,
      icon: 'fas fa-broom',
      cardDetail: {
        label: 'Limpeza e Higienização',
        value: 'limpeza',
      },
      disabled: false,
    },
    {
      id: 3,
      icon: 'fas fa-hard-hat',
      cardDetail: {
        label: 'Reformas e Construção',
        value: 'construcao',
      },
      disabled: false,
    },
    {
      id: 4,
      icon: 'fas fa-cogs',
      cardDetail: {
        label: 'Montagem e Instalação',
        value: 'montagem',
      },
      disabled: false,
    },
    {
      id: 5,
      icon: 'fas fa-seedling',
      cardDetail: {
        label: 'Jardim e Piscina',
        value: 'jardim',
      },
      disabled: false,
    },
    {
      id: 6,
      icon: 'fas fa-ellipsis-h',
      cardDetail: {
        label: 'Outros serviços',
        value: 'outros',
      },
      disabled: false,
    },
  ];

  highlights!: Highlight[];

  constructor(private route: Router, private cardsService: CardService) {}

  // Descrições para cada categoria
  private categoryDescriptions: { [key: string]: string } = {
    'Limpeza e Higienização':
      'Experimente nossos serviços exclusivos com qualidade superior e atendimento diferenciado.',
    'Reparos e Manutenção':
      'Aproveite nossas ofertas especiais com descontos exclusivos para você.',
    Tecnologia:
      'Soluções tecnológicas inovadoras para facilitar seu dia a dia.',
    Beleza:
      'Cuidados especiais para realçar sua beleza natural com profissionais qualificados.',
    Transporte:
      'Deslocamento seguro e confortável para todos os seus compromissos.',
    Saúde: 'Cuidados médicos e bem-estar com profissionais especializados.',
  };

  ngOnInit() {
    this.cardsService.getHighlightsCategorias().subscribe((data) => {
      // Filtra apenas os 2 highlights com maiores totais
      this.highlights = this.getTopTwoHighlights(data.highlights);
    });
  }

  // Método para pegar os 2 highlights com maiores totais
  private getTopTwoHighlights(highlights: Highlight[]): Highlight[] {
    if (!highlights || highlights.length === 0) {
      return [];
    }

    // Ordena do maior para o menor total
    const sortedHighlights = [...highlights].sort((a, b) => b.total - a.total);

    // Pega os 2 primeiros (maiores totais)
    return sortedHighlights.slice(0, 2);
  }

  getIconClass(categoria: string): string {
    // Encontra o card que corresponde à categoria
    const card = this.cardsMock.find(
      (card) => card.cardDetail.label.toLowerCase() === categoria.toLowerCase()
    );

    // Retorna o ícone do card encontrado ou um ícone padrão
    return card ? card.icon : 'fas fa-star fa-lg';
  }

  getDescription(categoria: string): string {
    return this.categoryDescriptions[categoria] || 'Descrição em breve.';
  }

  goToProposal(card: any) {
    this.route.navigate(['/proposal'], {
      queryParams: { cardTitle: card.cardDetail.label },
    });
  }
}
