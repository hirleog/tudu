import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterCategory } from 'src/app/interfaces/filters-model';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css'],
})
export class ProposalComponent implements OnInit {
  titleCard: string | null = null;
  selectedOptions: any[] = [];
  paramCategory: any;

  filterCategories: FilterCategory[] = [
    {
      title: '1. Local do Serviço',
      isSingleSelect: true, // Marca como seleção única
      options: [
        { label: 'Apartamento', value: 'apartment', selected: false },
        { label: 'Casa', value: 'house', selected: false },
        { label: 'Comercial/Escritório', value: 'commercial', selected: false },
        { label: 'Outro', value: 'other', selected: false },
      ],
    },
    {
      title: '2. Tipo de Pintura',
      options: [
        { label: 'Pintura interna', value: 'internal', selected: false },
        { label: 'Pintura externa', value: 'external', selected: false },
        {
          label: 'Pintura de muros/fachadas',
          value: 'facade',
          selected: false,
        },
        { label: 'Pintura de teto', value: 'ceiling_paint', selected: false }, // Alterado
        {
          label: 'Pintura de portas/portões',
          value: 'doors_paint',
          selected: false,
        }, // Alterado
        { label: 'Pintura de móveis', value: 'furniture', selected: false },
      ],
    },
    {
      title: '3. Área a Ser Pintada',
      options: [
        { label: 'Parede(s)', value: 'walls', selected: false },
        { label: 'Teto', value: 'ceiling_area', selected: false }, // Alterado
        { label: 'Portas/Janelas', value: 'doors_windows', selected: false },
        {
          label: 'Móveis embutidos',
          value: 'built_in_furniture',
          selected: false,
        },
        { label: 'Outros', value: 'other', selected: false },
      ],
    },
    {
      title: '4. Tipo de Superfície',
      options: [
        {
          label: 'Alvenaria (tijolo, concreto)',
          value: 'brick',
          selected: false,
        },
        { label: 'Drywall/Gesso', value: 'drywall', selected: false },
        { label: 'Madeira', value: 'wood', selected: false },
        { label: 'Metal', value: 'metal', selected: false },
        { label: 'Outros', value: 'other', selected: false },
      ],
    },
    {
      title: '5. Condição da Superfície',
      options: [
        { label: 'Nova (primeira pintura)', value: 'new', selected: false },
        {
          label: 'Já pintada (precisa de reparo/lixa)',
          value: 'repair',
          selected: false,
        },
        {
          label: 'Com infiltrações/umidade',
          value: 'humidity',
          selected: false,
        },
        { label: 'Com trincas/rachaduras', value: 'cracks', selected: false },
      ],
    },
    {
      title: '6. Serviços Adicionais',
      options: [
        {
          label: 'Preparação da superfície (lixamento, massa)',
          value: 'preparation',
          selected: false,
        },
        {
          label: 'Proteção de móveis e piso',
          value: 'protection',
          selected: false,
        },
        {
          label: 'Remoção de tinta antiga',
          value: 'paint_removal',
          selected: false,
        },
        {
          label: 'Pintura decorativa (textura, efeitos)',
          value: 'decorative',
          selected: false,
        },
      ],
    },
  ];

  constructor(private routeActive: ActivatedRoute, private route: Router) {
    // let filtersFormat: any; // Inicializa a variável filtersFormatted como null
    // let filtersFormatted: any;

    this.routeActive.queryParams.subscribe((params) => {
      const filters = params['filters'] ? JSON.parse(params['filters']) : null;
      // filtersFormatted = filters;

      // if (typeof filters === 'string') {
      //   filtersFormat = JSON.parse(filters);
      //   filtersFormatted = filtersFormatted;
      // }

      if (filters) {
        // Atualiza os checkboxes com base nos filtros selecionados
        this.filterCategories.forEach((category) => {
          // Encontra a categoria correspondente no JSON retornado
          const matchingCategory = filters.find(
            (filter: any) => filter.title === category.title
          );

          if (matchingCategory) {
            // Atualiza as opções da categoria com base nos filtros selecionados
            category.options.forEach((option) => {
              const selectedFilter = matchingCategory.filters.find(
                (filter: any) => filter.value === option.value
              );
              option.selected = !!selectedFilter; // Marca como selecionado se encontrado
            });
          }
        });
      }
    });

    this.routeActive.queryParams.subscribe((params) => {
      this.paramCategory = params['card'];
    });
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo
  }

  onSubmit(): void {
    const groupedOptions: { [key: string]: any } = {}; // Objeto para agrupar os filtros por título

    this.filterCategories.forEach((category) => {
      category.options.forEach((option) => {
        if (option.selected) {
          // Se o título já existir no agrupamento, adiciona o filtro ao array
          if (groupedOptions[category.title]) {
            groupedOptions[category.title].push(option);
          } else {
            // Caso contrário, cria uma nova entrada com o título e o filtro
            groupedOptions[category.title] = [option];
          }
        }
      });
    });

    // Converte o objeto agrupado em um array de objetos
    this.selectedOptions = Object.keys(groupedOptions).map((title) => ({
      title,
      filters: groupedOptions[title],
    }));

    // Navega para a próxima rota com os dados agrupados
    this.route.navigate(['/proposal/address'], {
      queryParams: {
        cardTitle: this.paramCategory,
        filters: JSON.stringify(this.selectedOptions),
      },
    });
    this.route.navigate(['/proposal/address'], {
      queryParams: {
        cardTitle: this.paramCategory,
        filters: JSON.stringify(this.selectedOptions),
      },
    });
  }
  goBack(): void {
    this.route.navigate(['/']);
  }
}
