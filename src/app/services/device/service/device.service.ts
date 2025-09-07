import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  constructor(private http: HttpClient) {}

  // No seu DeviceService
  async getDeviceInfo(): Promise<any> {
    const userAgent = navigator.userAgent;

    let realIp = '127.0.0.1';
    try {
      // Use a URL absoluta do seu backend
      const backendUrl = environment.apiUrl; // ← Adicione esta linha
      const response: any = await firstValueFrom(
        this.http.get(`${backendUrl}/api/get-my-ip`) // ← Use a URL completa
      );
      realIp = response.ip;
    } catch (error) {
      console.error('Falha ao obter IP do usuário:', error);
    }

    return {
      ip_address: realIp,
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
