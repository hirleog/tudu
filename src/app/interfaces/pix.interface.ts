export interface PixChargeData {
  reference_id: string;
  description?: string;
  value?: number;
  customer_name?: string;
  customer_email?: string;
  customer_tax_id?: string;
  expires_in_minutes?: number;
}

export interface PixResponse {
  success: boolean;
  message: string;
  data: {
    order_id: string;
    reference_id: string;
    qr_code: string;
    qr_code_image: string;
    expiration_date: string;
    local_payment_id: string;
    amount?: {
      value: number;
      currency: string;
    };
  };
}
