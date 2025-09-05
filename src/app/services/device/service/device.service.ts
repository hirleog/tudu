import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  getDeviceInfo(): any {
    const userAgent = navigator.userAgent;

    return {
      ip_address: '127.0.0.1', // Valor padrão
      device_id: this.generateDeviceId(),
      manufacturer: this.getManufacturerFromUA(userAgent),
      model: userAgent.substring(0, 50),
      platform: this.getPlatformFromUA(userAgent),
    };
  }

  // Métodos públicos para evitar erros de tipo
  generateDeviceId(): string {
    return `dev_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  getManufacturerFromUA(userAgent: string): string {
    if (/iphone|ipad|ipod/i.test(userAgent)) return 'Apple';
    if (/samsung/i.test(userAgent)) return 'Samsung';
    if (/motorola/i.test(userAgent)) return 'Motorola';
    if (/xiaomi|redmi|poco/i.test(userAgent)) return 'Xiaomi';
    return 'Unknown';
  }

  getPlatformFromUA(userAgent: string): string {
    if (/mobile/i.test(userAgent)) return 'Mobile';
    if (/tablet/i.test(userAgent)) return 'Tablet';
    return 'Desktop';
  }
}
