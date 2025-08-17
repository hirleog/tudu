export interface card {
  id: number;
  icon: string;
  cardDetail: CardDetail;
  disabled: boolean;
}

export interface CardDetail {
  label: string;
  value: string;
}
