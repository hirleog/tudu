export interface CreateCard {
    filters: []
    address: {
      cep: string; // CEP do endereço
      street: string; // Rua
      neighborhood: string; // Bairro
      city: string; // Cidade
      state: string; // Estado
      number: string; // Número
      complement?: string; // Complemento (opcional)
    };
    cardTitle: string; // Título do cartão
    dateTimeSelected: string; // Data e hora selecionadas
    price: string; // Preço do serviço
  }
  