export interface CardOrders {
  id?: number;
  id_pedido?: string;
  id_cliente?: number;
  id_prestador?: number;

  valor_negociado?: string;
  horario_negociado?: string;
  data_candidatura?: string;
  status?: string;

  categoria: string;
  subcategoria: string;
  valor: string;
  horario_preferencial: string;

  codigo_confirmacao?: string;
  data_finalizacao?: string;
  status_pedido: string; // publicado, em andamento, finalizado

  cep: string; // CEP do endereço
  street: string; // Rua
  neighborhood: string; // Bairro
  city: string; // Cidade
  state: string; // Estado
  number: string; // Número
  complement?: string; // Complemento (opcional)

  // para controle do dinamico dos botões doscards
  renegotiateActive?: boolean;
  calendarActive?: boolean;
  placeholderDataHora?: string;
  hasQuotes: boolean; // Se há orçamentos disponíveis
}
