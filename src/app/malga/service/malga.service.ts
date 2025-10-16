// src/app/services/malga.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface MalgaTokenizationRequest {
  card: {
    number: string;
    expirationMonth: string;
    expirationYear: string;
    securityCode: string;
    holderName: string;
  };
  customerId?: string;
}

export interface MalgaTokenizationResponse {
  tokenId: string;
  brand: string;
  expiryMonth: string;
  expiryYear: string;
  last4: string;
  holderName: string;
  customerId?: string;
  createdAt: string;
}

export interface MalgaPaymentRequest {
  // Campos principais (formato Malga)
  amount: number;
  originAmount?: any;

  currency: string;
  statementDescriptor: string;
  description: string;
  capture: boolean;
  orderId: string;

  // Estrutura de pagamento (formato Malga)
  paymentMethod: {
    paymentType: 'credit' | 'debit';
    installments: number;
  };

  paymentSource: {
    sourceType: 'card';
    card: {
      cardNumber: string;
      cardCvv: string;
      cardExpirationDate: string;
      cardHolderName: string;
    };
  };

  // Cliente (formato Malga)
  customer: {
    name: string;
    email: string;
    phoneNumber: string;
    document: {
      type: string;
      number: string;
    };
    address: {
      street: string;
      number: string;
      district: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
  };

  // App Info (opcional)
  appInfo?: {
    platform?: {
      integrator?: string;
      name?: string;
      version?: string;
    };
    device?: {
      name?: string;
      version?: string;
    };
    system?: {
      name?: string;
      version?: string;
    };
  };

  // Campos para compatibilidade com seu backend
  id_pedido: string;
  // credit?: {
  //   number_installments?: number;
  //   amount_installment?: number;
  //   soft_descriptor?: string;
  //   transaction_type?: string;
  // };
  installment_data?: {
    total_with_tax?: number;
    installments?: number;
    installment_value?: number;
  };
}

export interface MalgaPaymentWithTokenRequest {
  merchantId: string;
  amount: number;
  currency: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    phoneNumber: string;
    document: {
      type: string;
      number: string;
    };
    address: {
      street: string;
      number: string;
      neighborhood: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
  };
  tokenId: string;
  securityCode: string;
  installments: number;
}

export interface MalgaTokenizeAndPayRequest {
  merchantId: string;
  amount: number;
  currency: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    phoneNumber: string;
    document: {
      type: string;
      number: string;
    };
    address: {
      street: string;
      number: string;
      neighborhood: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
  };
  card: {
    number: string;
    expirationMonth: string;
    expirationYear: string;
    securityCode: string;
    holderName: string;
  };
  installments: number;
  saveCard?: boolean;
}

export interface MalgaPaymentResponse {
  chargeId: string;
  status: 'approved' | 'declined' | 'pending';
  amount: number;
  currency: string;
  orderId: string;
  paymentMethod: any;
  createdAt: string;
  message?: string;
  tokenId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MalgaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Tokenizar cartão
  tokenizeCard(tokenData: MalgaTokenizationRequest) {
    return this.http.post<MalgaTokenizationResponse>(
      `${this.apiUrl}/malga/tokens`,
      tokenData
    );
  }

  // Processar pagamento com cartão (sem tokenização)
  processCreditCardPayment(paymentData: MalgaPaymentRequest) {
    return this.http.post<MalgaPaymentResponse>(
      `${this.apiUrl}/malga/charges`,
      paymentData
    );
  }

  // Processar pagamento com token salvo
  processPaymentWithToken(paymentData: MalgaPaymentWithTokenRequest) {
    return this.http.post<MalgaPaymentResponse>(
      `${this.apiUrl}/malga/payments/token`,
      paymentData
    );
  }

  // Tokenizar e pagar em uma única chamada
  tokenizeAndPay(paymentData: MalgaPaymentRequest) {
    return this.http.post<MalgaPaymentResponse>(
      `${this.apiUrl}/malga/payments/tokenize-and-pay`,
      paymentData
    );
  }

  // Processar PIX
  processPixPayment(paymentData: any) {
    return this.http.post(`${this.apiUrl}/malga/charges`, {
      ...paymentData,
      paymentMethod: {
        paymentType: 'pix',
      },
    });
  }
}
