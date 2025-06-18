import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterCategory, FilterOption } from 'src/app/interfaces/filters-model';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.css'],
})
export class CategoryFilterComponent implements OnInit {
  @Input() serviceTitle!: string; // Título dinâmico ("Pintura Residencial")
  @Input() filterCategories!: FilterCategory[]; // Estrutura dos filtros
  @Output() filtersSubmitted = new EventEmitter<any>();

  showOtherInput: boolean = false;

  selectedFiles: File[] = [];
  selectedPreviews: string[] = [];

  searchTerm = '';
  selectedCount = 0;

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.updateSelectedCount();
  }

  getCategoryIcon(title: string): string {
    const iconMap: { [key: string]: string } = {
      '1. Local do Serviço': 'fas fa-home',
      '2. Tipo de Pintura': 'fas fa-paint-roller',
      '3. Área a Ser Pintada': 'fas fa-ruler-combined',
      '4. Tipo de Superfície': 'fas fa-layer-group',
      '5. Condição da Superfície': 'fas fa-search',
      '6. Serviços Adicionais': 'fas fa-tools',
    };
    return iconMap[title] || 'fas fa-filter';
  }

  toggleCategory(category: FilterCategory): void {
    category.expanded = !category.expanded;
  }

  onOptionSelected(category: FilterCategory, option: FilterOption): void {
    if (category.isSingleSelect) {
      // Para seleção única, desmarcar outras opções
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

    console.log('Filtros aplicados:', selectedFilters);
    // Aqui você pode emitir os filtros ou chamar um serviço
  }

  // mudar para o proposal
  onFilesSelected(event: any) {
    const files = event.target.files;
    this.selectedFiles = [];
    this.selectedPreviews = [];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Guarda o arquivo
        this.selectedFiles.push(file);
        this.sharedService.setFiles(this.selectedFiles);

        // Cria preview (data URL)
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
    this.filtersSubmitted.emit();
  }
}
