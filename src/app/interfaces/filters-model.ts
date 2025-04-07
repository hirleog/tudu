export interface FilterCategory {
  title: string;
  options: FilterOption[];
  isSingleSelect?: boolean; // Flag para indicar se é seleção única
}

export interface FilterOption {
  label: string; // Ex: "Apartamento"
  value: string; // Ex: "apartment" (para lógica interna)
  selected: boolean; // Estado do checkbox
}
