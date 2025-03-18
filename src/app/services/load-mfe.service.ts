// src/app/services/load-mfe.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadMfeService {
  private baseUrl = 'http://localhost:4201/'; // URL do servidor local do MFE

  constructor() {}

  loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      document.body.appendChild(script);
    });
  }

  loadMfe(): Promise<void> {
    const scripts = [
      `${this.baseUrl}runtime.js`,
      `${this.baseUrl}polyfills.js`,
      `${this.baseUrl}main.js`,
      `${this.baseUrl}vendor.js`,
    ];

    return Promise.all(scripts.map((script) => this.loadScript(script)))
      .then(() => console.log('MFE carregado com sucesso!'))
      .catch((err) => console.error('Erro ao carregar MFE:', err));
  }
}
