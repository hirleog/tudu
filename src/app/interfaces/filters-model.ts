export interface FilterCategory {
  title: string; // Ex: "1. Local do Serviço"
  options: FilterOption[]; // Subcategorias (checkboxes)
}

export interface FilterOption {
  label: string; // Ex: "Apartamento"
  value: string; // Ex: "apartment" (para lógica interna)
  selected: boolean; // Estado do checkbox
}
