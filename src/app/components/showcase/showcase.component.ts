import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { card } from '../../interfaces/card';
import { loadRemoteModule } from '@angular-architects/module-federation';

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
      title: 'Montador de Moveis',
      disabled: false,
    },
    {
      id: 2,
      icon: 'fas fa-home',
      title: 'Serviços Domésticos',
      disabled: true,
    },
    {
      id: 3,
      icon: 'fas fa-wrench',
      title: 'Reformas e Reparos',
      disabled: true,
    },
    { id: 4, icon: 'fas fa-briefcase', title: 'Consultoria', disabled: true },
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
    // this.route.navigate(['/proposal', card]);
  }
}
