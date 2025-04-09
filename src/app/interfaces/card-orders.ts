export interface CardOrders {
  id: number;
  categoria: string;
  subcategoria: string;
  address: string;
  valor: string;
  editedPrice?: string;
  horario_preferencial: string;

  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  number: string;
  complement: string;

  icon?: string;
  renegotiateActive?: boolean;
  calendarActive?: boolean;
  placeholderDataHora?: string;
  hasQuotes?: boolean; // Se há orçamentos disponíveis
}
