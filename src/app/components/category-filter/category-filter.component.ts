import { Component, Input, OnInit } from '@angular/core';
import { FilterCategory, FilterOption } from 'src/app/interfaces/filters-model';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.css'],
})
export class CategoryFilterComponent implements OnInit {
  @Input() serviceTitle!: string; // Título dinâmico ("Pintura Residencial")
  @Input() filterCategories!: FilterCategory[]; // Estrutura dos filtros
  showOtherInput: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  onOptionSelected(
    category: FilterCategory,
    selectedOption: FilterOption
  ): void {
    if (category.isSingleSelect) {
      // Desmarca todas as outras opções do mesmo grupo
      category.options.forEach((option) => {
        option.selected = option.value === selectedOption.value;
      });
    } else {
      //   // Comportamento normal de checkbox (multiseleção)
      selectedOption.selected = selectedOption.selected;
    }
  }
}
