export interface PortfolioItemModel {
  id: number;
  titulo: string;
  descricao: string;
  tipo: string;
  empresa: string;
  data_inicio: string;
  data_fim: string;
  imagens: {
    url: string;
  }[];
}
