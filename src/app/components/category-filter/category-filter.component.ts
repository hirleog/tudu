import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterCategory, FilterOption } from 'src/app/interfaces/filters-model';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.css'],
})
export class CategoryFilterComponent implements OnInit {
  @Input() serviceTitle!: string;
  @Input() filterCategories!: FilterCategory[];
  @Input() serviceDescription!: string;
  // @Input() serviceType!: string;
  @Output() filtersSubmitted = new EventEmitter<any>();

  showOtherInput: boolean = false;
  selectedFiles: File[] = [];
  selectedPreviews: string[] = [];
  searchTerm = '';
  selectedCount = 0;

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    if (this.serviceTitle) {
      this.initializeFiltersByServiceType(this.serviceTitle);
    }
    this.updateSelectedCount();
  }

  initializeFiltersByServiceType(serviceTitle: string) {
    switch (serviceTitle) {
      case 'Reparos e Manutenção':
        this.filterCategories = this.getReparosManutencaoFilters();
        break;
      case 'Limpeza e Higienização':
        this.filterCategories = this.getLimpezaHigienizacaoFilters();
        break;
      case 'Reformas e Construção':
        this.filterCategories = this.getReformasConstrucaoFilters();
        break;
      case 'Montagem e Instalação':
        this.filterCategories = this.getMontagemInstalacaoFilters();
        break;
      case 'Jardim e Piscina':
        this.filterCategories = this.getJardimPiscinaFilters();
        break;
      default:
        this.filterCategories = this.getDefaultFilters();
    }
  }

  private getReparosManutencaoFilters(): FilterCategory[] {
    return [
      {
        title: '1. Tipo de Reparo',
        isSingleSelect: true,
        expanded: true,
        options: [
          { label: 'Elétrica', value: 'eletrica', selected: false },
          { label: 'Hidráulica', value: 'hidraulica', selected: false },
          {
            label: 'Pequenos consertos',
            value: 'pequenos-consertos',
            selected: false,
          },
          {
            label: 'Instalação de equipamentos',
            value: 'instalacao-equipamentos',
            selected: false,
          },
          { label: 'Outro', value: 'other', selected: false },
        ],
        otherText: '',
      },
      {
        title: '2. Local do Serviço',
        isSingleSelect: true,
        expanded: true,
        options: [
          { label: 'Apartamento', value: 'apartamento', selected: false },
          { label: 'Casa', value: 'casa', selected: false },
          {
            label: 'Comercial/Escritório',
            value: 'comercial',
            selected: false,
          },
          { label: 'Outro', value: 'other', selected: false },
        ],
        otherText: '',
      },
      {
        title: '3. Cômodo do Serviço',
        isSingleSelect: false,
        expanded: true,
        options: [
          { label: 'Cozinha', value: 'cozinha', selected: false },
          { label: 'Banheiro', value: 'banheiro', selected: false },
          { label: 'Sala', value: 'sala', selected: false },
          { label: 'Quarto', value: 'quarto', selected: false },
          { label: 'Área externa', value: 'area-externa', selected: false },
          { label: 'Outro', value: 'other', selected: false },
        ],
        otherText: '',
      },
      {
        title: '4. Materiais',
        isSingleSelect: true,
        expanded: true,
        options: [
          {
            label: 'Já tenho os materiais',
            value: 'ja-tem-materiais',
            selected: false,
          },
          {
            label: 'Preciso que o profissional traga',
            value: 'profissional-traz',
            selected: false,
          },
          { label: 'Parcialmente', value: 'parcialmente', selected: false },
        ],
        otherText: '',
      },
    ];
  }

  private getLimpezaHigienizacaoFilters(): FilterCategory[] {
    return [
      {
        title: '1. Tipo de Limpeza',
        isSingleSelect: true,
        expanded: true,
        options: [
          {
            label: 'Faxina residencial',
            value: 'faxina-residencial',
            selected: false,
          },
          { label: 'Pós-obra', value: 'pos-obra', selected: false },
          { label: 'Limpeza pesada', value: 'limpeza-pesada', selected: false },
          {
            label: 'Higienização de estofados',
            value: 'higienizacao-estofados',
            selected: false,
          },
          { label: 'Outro', value: 'other', selected: false },
        ],
        otherText: '',
      },
      {
        title: '2. Ambientes',
        isSingleSelect: false,
        expanded: true,
        options: [
          { label: 'Cozinha', value: 'cozinha', selected: false },
          { label: 'Banheiro', value: 'banheiro', selected: false },
          { label: 'Sala', value: 'sala', selected: false },
          { label: 'Quarto', value: 'quarto', selected: false },
          { label: 'Área externa', value: 'area-externa', selected: false },
          {
            label: 'Todos os cômodos',
            value: 'todos-comodos',
            selected: false,
          },
        ],
        otherText: '',
      },
      {
        title: '3. Produtos de Limpeza',
        isSingleSelect: true,
        expanded: true,
        options: [
          {
            label: 'Já tenho os produtos',
            value: 'ja-tem-produtos',
            selected: false,
          },
          {
            label: 'Preciso que o profissional traga',
            value: 'profissional-traz',
            selected: false,
          },
          { label: 'Parcialmente', value: 'parcialmente', selected: false },
        ],
        otherText: '',
      },
    ];
  }

  private getReformasConstrucaoFilters(): FilterCategory[] {
    return [
      {
        title: '1. Tipo de Serviço',
        isSingleSelect: true,
        expanded: true,
        options: [
          { label: 'Pintura', value: 'pintura', selected: false },
          { label: 'Marcenaria', value: 'marcenaria', selected: false },
          {
            label: 'Pequena obra/demolição',
            value: 'pequena-obra',
            selected: false,
          },
          {
            label: 'Troca de piso/revestimento',
            value: 'troca-piso',
            selected: false,
          },
          { label: 'Outro', value: 'other', selected: false },
        ],
        otherText: '',
      },
      {
        title: '2. Cômodo',
        isSingleSelect: false,
        expanded: true,
        options: [
          { label: 'Cozinha', value: 'cozinha', selected: false },
          { label: 'Banheiro', value: 'banheiro', selected: false },
          { label: 'Sala', value: 'sala', selected: false },
          { label: 'Quarto', value: 'quarto', selected: false },
          { label: 'Área externa', value: 'area-externa', selected: false },
        ],
        otherText: '',
      },
      {
        title: '3. Materiais',
        isSingleSelect: true,
        expanded: true,
        options: [
          {
            label: 'Já tenho os materiais',
            value: 'ja-tem-materiais',
            selected: false,
          },
          {
            label: 'Preciso que o profissional traga',
            value: 'profissional-traz',
            selected: false,
          },
          { label: 'Parcialmente', value: 'parcialmente', selected: false },
        ],
        otherText: '',
      },
    ];
  }

  private getMontagemInstalacaoFilters(): FilterCategory[] {
    return [
      {
        title: '1. Tipo de Item',
        isSingleSelect: false,
        expanded: true,
        options: [
          { label: 'Móveis', value: 'moveis', selected: false },
          { label: 'TV', value: 'tv', selected: false },
          { label: 'Cortinas', value: 'cortinas', selected: false },
          { label: 'Prateleiras', value: 'prateleiras', selected: false },
          { label: 'Suportes', value: 'suportes', selected: false },
          { label: 'Outro', value: 'other', selected: false },
        ],
        otherText: '',
      },
      {
        title: '2. Estado do Item',
        isSingleSelect: true,
        expanded: true,
        options: [
          {
            label: 'Desmontado e pronto para montar',
            value: 'desmontado',
            selected: false,
          },
          {
            label: 'Parcialmente desmontado',
            value: 'parcialmente-desmontado',
            selected: false,
          },
          {
            label: 'Montado, precisa ajustar',
            value: 'montado-ajustar',
            selected: false,
          },
        ],
        otherText: '',
      },
      {
        title: '3. Materiais',
        isSingleSelect: true,
        expanded: true,
        options: [
          {
            label: 'Já tenho todos os materiais',
            value: 'ja-tem-materiais',
            selected: false,
          },
          {
            label: 'Preciso que o profissional traga',
            value: 'profissional-traz',
            selected: false,
          },
          { label: 'Parcialmente', value: 'parcialmente', selected: false },
        ],
        otherText: '',
      },
    ];
  }

  private getJardimPiscinaFilters(): FilterCategory[] {
    return [
      {
        title: '1. Tipo de Serviço',
        isSingleSelect: false,
        expanded: true,
        options: [
          { label: 'Corte de grama', value: 'corte-grama', selected: false },
          { label: 'Poda de plantas', value: 'poda-plantas', selected: false },
          {
            label: 'Limpeza de jardim',
            value: 'limpeza-jardim',
            selected: false,
          },
          {
            label: 'Manutenção de piscina',
            value: 'manutencao-piscina',
            selected: false,
          },
          { label: 'Outro', value: 'other', selected: false },
        ],
        otherText: '',
      },
      {
        title: '2. Tamanho da Área',
        isSingleSelect: true,
        expanded: true,
        options: [
          { label: 'Pequena (até 50m²)', value: 'pequena', selected: false },
          { label: 'Média (50-150m²)', value: 'media', selected: false },
          { label: 'Grande (+150m²)', value: 'grande', selected: false },
          { label: 'Não sei', value: 'nao-sei', selected: false },
        ],
        otherText: '',
      },
      {
        title: '3. Equipamentos',
        isSingleSelect: true,
        expanded: true,
        options: [
          {
            label: 'Tenho equipamentos',
            value: 'tenho-equipamentos',
            selected: false,
          },
          {
            label: 'Preciso que o profissional traga',
            value: 'profissional-traz',
            selected: false,
          },
          { label: 'Parcialmente', value: 'parcialmente', selected: false },
        ],
        otherText: '',
      },
    ];
  }

  private getDefaultFilters(): FilterCategory[] {
    return [
      {
        title: '1. Local do Serviço',
        isSingleSelect: true,
        expanded: true,
        options: [
          { label: 'Apartamento', value: 'apartamento', selected: false },
          { label: 'Casa', value: 'casa', selected: false },
          {
            label: 'Comercial/Escritório',
            value: 'comercial',
            selected: false,
          },
          { label: 'Outro', value: 'other', selected: false },
        ],
        otherText: '',
      },
    ];
  }

  getCategoryIcon(title: string): string {
    const iconMap: { [key: string]: string } = {
      '1. Tipo de Reparo': 'fas fa-tools',
      '1. Tipo de Limpeza': 'fas fa-broom',
      '1. Tipo de Serviço': 'fas fa-hammer',
      '1. Tipo de Item': 'fas fa-couch',
      '1. Local do Serviço': 'fas fa-home',
      '2. Local do Serviço': 'fas fa-map-marker-alt',
      '2. Ambientes': 'fas fa-door-open',
      '2. Cômodo': 'fas fa-door-open',
      '2. Estado do Item': 'fas fa-box-open',
      '2. Tamanho da Área': 'fas fa-ruler-combined',
      '3. Cômodo do Serviço': 'fas fa-door-open',
      '3. Produtos de Limpeza': 'fas fa-pump-soap',
      '3. Materiais': 'fas fa-boxes',
      '3. Equipamentos': 'fas fa-tools',
      '4. Materiais': 'fas fa-boxes',
    };
    return iconMap[title] || 'fas fa-filter';
  }

  toggleCategory(category: FilterCategory): void {
    category.expanded = !category.expanded;
  }

  onOptionSelected(category: FilterCategory, option: FilterOption): void {
    // Inverte o estado de seleção
    option.selected = !option.selected;

    if (category.isSingleSelect && option.selected) {
      // Desmarca todas as outras opções se for single select
      category.options.forEach((opt) => {
        if (opt.value !== option.value) {
          opt.selected = false;
        }
      });
    }

    this.updateSelectedCount();
  }

  hasOtherSelected(category: FilterCategory): boolean {
    return category.options.some(
      (opt) => opt.value === 'other' && opt.selected
    );
  }

  updateSelectedCount(): void {
    this.selectedCount = this.filterCategories.reduce((count, category) => {
      return count + category.options.filter((opt) => opt.selected).length;
    }, 0);
  }

  resetFilters(): void {
    this.filterCategories.forEach((category) => {
      category.options.forEach((option) => {
        option.selected = false;
      });
      category.otherText = '';
    });
    this.searchTerm = '';
    this.selectedCount = 0;
  }

  searchFilters(): void {
    const searchTerm = this.searchTerm.toLowerCase();
    this.filterCategories.forEach((category) => {
      const hasMatchInTitle = category.title.toLowerCase().includes(searchTerm);
      const hasMatchInOptions = category.options.some((option) =>
        option.label.toLowerCase().includes(searchTerm)
      );
      if (hasMatchInTitle || hasMatchInOptions) {
        category.expanded = true;
      }
    });
  }

  applyFilters(): void {
    const selectedFilters: any = {};
    this.filterCategories.forEach((category) => {
      const selectedOptions = category.options
        .filter((opt) => opt.selected)
        .map((opt) => ({
          value: opt.value,
          label: opt.label,
          otherText: opt.value === 'other' ? category.otherText : null,
        }));
      if (selectedOptions.length > 0) {
        selectedFilters[category.title] = selectedOptions;
      }
    });
  }

  onFilesSelected(event: any) {
    const files = event.target.files;
    this.selectedFiles = [];
    this.selectedPreviews = [];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.selectedFiles.push(file);
        this.sharedService.setFiles(this.selectedFiles);

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedPreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.selectedPreviews.splice(index, 1);
  }

  submitFilters(): void {
    this.filtersSubmitted.emit({
      filters: this.filterCategories,
      serviceDescription: this.serviceDescription,
    });
  }
}
