// src/app/utils/payment-formatter.ts
export class PaymentFormatter {
  static convertRealToCents(amount: number): number {
    return Math.round(amount * 100);
  }

  static formatDocument(document: string): string {
    return document.replace(/\D/g, '');
  }

  static formatZipCode(zipCode: string): string {
    return zipCode.replace(/\D/g, '');
  }

  static formatPhoneNumber(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  static formatCardNumber(cardNumber: string): string {
    return cardNumber.replace(/\D/g, '');
  }

  static mapCardBrand(brand: string): string {
    const brandsMap: { [key: string]: string } = {
      visa: 'visa',
      mastercard: 'mastercard',
      amex: 'amex',
      elo: 'elo',
      hipercard: 'hipercard',
      diners: 'diners',
    };
    return brandsMap[brand.toLowerCase()] || brand.toLowerCase();
  }

  static getFullName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`.trim();
  }
}
