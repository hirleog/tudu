import { Component, Input, OnInit } from '@angular/core';
import { FilterCategory } from 'src/app/interfaces/filters-model';

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
}
