export interface ListCard {
    categoria: string;
    subcategoria: string;
    address: {
      cep: string; // CEP do endereço
      street: string; // Rua
      neighborhood: string; // Bairro
      city: string; // Cidade
      state: string; // Estado
      number: string; // Número
      complement?: string; // Complemento (opcional)
    };
    valor: string;
    horario_preferencial: string;
  }
  