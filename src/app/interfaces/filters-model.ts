export interface FilterCategory {
  title: string;
  options: FilterOption[];
  isSingleSelect?: boolean; // Flag para indicar se é seleção única
}

export interface AddressContent {
  cep: string; // CEP do endereço
  street: string; // Rua
  neighborhood: string; // Bairro
  city: string; // Cidade
  state: string; // Estado
  number: string; // Número
  complement?: string; // Complemento (opcional)
}

export interface FilterOption {
  label: string; // Ex: "Apartamento"
  value: string; // Ex: "apartment" (para lógica interna)
  selected: boolean; // Estado do checkbox
}


