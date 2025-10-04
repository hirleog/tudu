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
  serviceDescription!: string;
  priceEstimation!: string;

  isLoading: boolean = false;
  serviceType: string = 'reparos-manutencao'; // Define o tipo de serviço como 'painting'

  filterCategories!: FilterCategory[];
  filters: any;

  constructor(private routeActive: ActivatedRoute, private route: Router) {
    // let filtersFormat: any; // Inicializa a variável filtersFormatted como null
    // let filtersFormatted: any;

    this.routeActive.queryParams.subscribe((params) => {
      this.filters = params['filters'] ? JSON.parse(params['filters']) : null;
      this.paramCategory = params['cardTitle'] || null; // Obtém o título do card dos parâmetros da rota
      this.serviceDescription = params['serviceDescription'] || ''; // Obtém a descrição do serviço dos parâmetros da rota});
      this.priceEstimation = params['priceEstimation'] || ''; // Obtém a descrição do serviço dos parâmetros da rota});
    });

    // this.routeActive.queryParams.subscribe((params) => {
    //   this.paramCategory = params['cardTitle'] || null; // Obtém o título do card dos parâmetros da rota
    // });
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo
  }

  onSubmit(filters: any): void {
    const groupedOptions: { [key: string]: any } = {}; // Objeto para agrupar os filtros por título

    filters.filters.forEach((category: any) => {
      category.options.forEach((option: any) => {
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
        serviceDescription: filters.serviceDescription,
        priceEstimation: filters.priceEstimation,
      },
    });
    this.route.navigate(['/proposal/address'], {
      queryParams: {
        cardTitle: this.paramCategory,
        filters: JSON.stringify(this.selectedOptions),
        serviceDescription: filters.serviceDescription,
        priceEstimation: filters.priceEstimation,
      },
    });
  }
  goBack(): void {
    this.route.navigate(['/']);
  }
}
