import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.css']
})
export class MultiSelectComponent implements OnInit {

  options: string[] = [];
  selectedOptions: string[] = [];

  filterText: string = '';  // Texto digitado no filtro
  filteredOptions: string[] = [];

  @Input() withoutInput: boolean = true;
  @Input() step: string = '';

  constructor() { }

  ngOnInit(): void {

    switch (this.step) {
      case '1':
        this.options = ['Aparador', 'Armário de banheiro', 'Armario de cozinha', 'Beliche ou triliche', 'Berço'];
        this.filteredOptions = [...this.options];
        break;
        case '2':
          this.options = ['Montagem', 'Desmontagem'];
          this.filteredOptions = [...this.options];
        break;

      default:
        break;
    }
  }


  // Lógica para filtrar as opções conforme o texto digitado
  onFilterChange() {

    if (this.filterText) {
      this.filteredOptions = this.options.filter(option =>
        option.toLowerCase().includes(this.filterText.toLowerCase()) // Filtra as opções
      );
    } else {
      this.filteredOptions = [...this.options]; // Se o filtro estiver vazio, exibe todas as opções
    }
  }

  // Método chamado quando uma checkbox é alterada
  onOptionChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedOptions.push(checkbox.value);
    } else {
      this.selectedOptions = this.selectedOptions.filter(option => option !== checkbox.value);
    }
  }

}
