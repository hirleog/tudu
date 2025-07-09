export interface CreateCard {
  id_pedido?: string;
  id_cliente?: number;
  id_prestador?: any;

  categoria: string;
  subcategoria: string;
  serviceDescription: string; // Descrição do serviço
  valor: number;
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
}
