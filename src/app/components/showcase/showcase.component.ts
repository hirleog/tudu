import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { card } from '../../interfaces/card';
import { FilterCategory } from 'src/app/interfaces/filters-model';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.css'],
})
export class ShowcaseComponent implements OnInit {
  @ViewChild('mfeContainer', { read: ViewContainerRef })
  mfeContainer!: ViewContainerRef;

  selectedCard: number | null = null;
  searchValue: string = '';

  serviceCards: card[] = [
    {
      id: 1,
      icon: 'fas fa-tools',
      cardDetail: {
        label: 'Serviços de Manutenção',
        value: 'manutencao',
      },
      disabled: false,
    },
    {
      id: 2,
      icon: 'fas fa-paint-roller',
      cardDetail: {
        label: 'Pintura Residencial',
        value: 'pintura',
      },
      disabled: false,
    },
    {
      id: 2,
      icon: 'fas fa-home',
      cardDetail: {
        label: 'Limpeza e Conservação',
        value: 'limpeza',
      },
      disabled: true,
    },
    {
      id: 3,
      icon: 'fas fa-wrench',
      cardDetail: {
        label: 'Reformas e Reparos',
        value: 'reformas',
      },
      disabled: true,
    },
    {
      id: 4,
      icon: 'fas fa-briefcase',
      cardDetail: {
        label: 'Consultoria',
        value: 'consultoria',
      },
      disabled: true,
    },
  ];




  // infos que viram do backend
  filterCategories: FilterCategory[] = [
    {
      title: "1. Local do Serviço",
      options: [
        { label: "Apartamento", value: "apartment", selected: false },
        { label: "Casa", value: "house", selected: false },
        { label: "Comercial/Escritório", value: "commercial", selected: false },
      ],
    },
    {
      title: "2. Tipo de Pintura",
      options: [
        { label: "Pintura interna", value: "internal", selected: false },
        { label: "Pintura externa", value: "external", selected: false },
      ],
    },
    // ... outras categorias
  ];

  constructor(private route: Router, private cfr: ComponentFactoryResolver) {}

  async ngOnInit() {
    // try {
    //   // Carrega o módulo exposto pelo MFE
    //   const module = await loadRemoteModule({
    //     remoteEntry: 'http://localhost:4201/remoteEntry.js', // URL do remoteEntry do MFE
    //     remoteName: 'tuduProfessional', // Nome do MFE
    //     exposedModule: './BudgetsModule', // Nome do módulo exposto
    //   });
    //   // Obtém o componente usando o método estático
    //   const component = module.BudgetsModule.getComponent();
    //   // Cria uma instância do componente e o insere no template
    //   const componentFactory = this.cfr.resolveComponentFactory(component);
    //   const componentRef = this.mfeContainer.createComponent(componentFactory);
    // } catch (error) {
    //   console.error('Erro ao carregar o MFE:', error);
    // }
  }

  search() {
    if (this.searchValue.trim()) {
      console.log('Você pesquisou por:', this.searchValue);
      // Aqui você pode implementar a lógica para buscar os serviços
    }
  }

  // Função para selecionar um card
  selectCard(card: any) {
    this.selectedCard = card;

    // passar o conteudo por shared service
    // this.route.navigate(['/proposal', { card: card.cardDetail.value }]);
    this.route.navigate(['/proposal']);
  }
}
