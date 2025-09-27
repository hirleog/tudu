// price-estimation.service.ts
import { Injectable } from '@angular/core';

export interface PriceEstimation {
  basePrice: number;
  minPrice: number;
  maxPrice: number;
  factors: string[];
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class PriceEstimationService {
  constructor() {}

  getPriceEstimation(serviceType: string, filters: any): PriceEstimation {
    return this.estimatePrice(serviceType, filters);
  }

  estimatePrice(serviceType: string, selectedFilters: any): PriceEstimation {
    switch (serviceType) {
      case 'Reparos e Manutenção':
        return this.estimateReparosPrice(selectedFilters);
      case 'Limpeza e Higienização':
        return this.estimateLimpezaPrice(selectedFilters);
      case 'Reformas e Construção':
        return this.estimateConstrucaoPrice(selectedFilters);
      case 'Montagem e Instalação':
        return this.estimateMontagemPrice(selectedFilters);
      case 'Jardim e Piscina':
        return this.estimateJardimPrice(selectedFilters);
      default:
        return this.getDefaultPrice();
    }
  }

  private estimateReparosPrice(filters: any): PriceEstimation {
    let basePrice = 80;
    let minPrice = 50;
    let maxPrice = 300;
    const factors: string[] = [];

    // Tipo de Reparo
    const tipoReparo = this.getSelectedValue(filters, '1. Tipo de Reparo');
    switch (tipoReparo) {
      case 'eletrica':
        basePrice = 120;
        minPrice = 80;
        maxPrice = 400;
        factors.push('Serviço elétrico especializado');
        break;
      case 'hidraulica':
        basePrice = 150;
        minPrice = 100;
        maxPrice = 500;
        factors.push('Serviço hidráulico complexo');
        break;
      case 'pequenos-consertos':
        basePrice = 70;
        minPrice = 50;
        maxPrice = 200;
        factors.push('Reparos simples');
        break;
      case 'instalacao-equipamentos':
        basePrice = 100;
        minPrice = 70;
        maxPrice = 350;
        factors.push('Instalação de equipamentos');
        break;
    }

    // Local do Serviço
    const local = this.getSelectedValue(filters, '2. Local do Serviço');
    if (local === 'comercial') {
      basePrice *= 1.3;
      minPrice *= 1.2;
      maxPrice *= 1.4;
      factors.push('Local comercial');
    }

    // Número de cômodos
    const comodos = this.getSelectedCount(filters, '3. Cômodo do Serviço');
    if (comodos > 1) {
      basePrice += (comodos - 1) * 30;
      minPrice += (comodos - 1) * 20;
      maxPrice += (comodos - 1) * 50;
      factors.push(`${comodos} cômodos`);
    }

    // Materiais
    const materiais = this.getSelectedValue(filters, '4. Materiais');
    if (materiais === 'profissional-traz') {
      basePrice *= 1.4;
      minPrice *= 1.3;
      maxPrice *= 1.5;
      factors.push('Materiais incluídos');
    }

    return {
      basePrice: Math.round(basePrice),
      minPrice: Math.round(minPrice),
      maxPrice: Math.round(maxPrice),
      factors,
      description: this.getReparosDescription(tipoReparo),
    };
  }

  private estimateLimpezaPrice(filters: any): PriceEstimation {
    let basePrice = 100;
    let minPrice = 70;
    let maxPrice = 400;
    const factors: string[] = [];

    // Tipo de Limpeza
    const tipoLimpeza = this.getSelectedValue(filters, '1. Tipo de Limpeza');
    switch (tipoLimpeza) {
      case 'faxina-residencial':
        basePrice = 120;
        minPrice = 80;
        maxPrice = 300;
        factors.push('Faxina residencial completa');
        break;
      case 'pos-obra':
        basePrice = 200;
        minPrice = 150;
        maxPrice = 500;
        factors.push('Limpeza pós-obra (complexa)');
        break;
      case 'limpeza-pesada':
        basePrice = 180;
        minPrice = 120;
        maxPrice = 450;
        factors.push('Limpeza pesada');
        break;
      case 'higienizacao-estofados':
        basePrice = 150;
        minPrice = 100;
        maxPrice = 350;
        factors.push('Higienização de estofados');
        break;
    }

    // Número de ambientes
    const ambientes = this.getSelectedCount(filters, '2. Ambientes');
    if (ambientes > 0) {
      if (ambientes >= 4) {
        basePrice *= 1.5;
        minPrice *= 1.4;
        maxPrice *= 1.6;
        factors.push(`${ambientes} ambientes (grande área)`);
      } else {
        basePrice += (ambientes - 1) * 40;
        minPrice += (ambientes - 1) * 30;
        maxPrice += (ambientes - 1) * 60;
        factors.push(`${ambientes} ambientes`);
      }
    }

    // Produtos
    const produtos = this.getSelectedValue(filters, '3. Produtos de Limpeza');
    if (produtos === 'profissional-traz') {
      basePrice *= 1.3;
      minPrice *= 1.2;
      maxPrice *= 1.4;
      factors.push('Produtos incluídos');
    }

    return {
      basePrice: Math.round(basePrice),
      minPrice: Math.round(minPrice),
      maxPrice: Math.round(maxPrice),
      factors,
      description: this.getLimpezaDescription(tipoLimpeza),
    };
  }

  private estimateConstrucaoPrice(filters: any): PriceEstimation {
    let basePrice = 200;
    let minPrice = 100;
    let maxPrice = 1000;
    const factors: string[] = [];

    // Tipo de Serviço
    const tipoServico = this.getSelectedValue(filters, '1. Tipo de Serviço');
    switch (tipoServico) {
      case 'pintura':
        basePrice = 150;
        minPrice = 80;
        maxPrice = 600;
        factors.push('Serviço de pintura');
        break;
      case 'marcenaria':
        basePrice = 250;
        minPrice = 150;
        maxPrice = 800;
        factors.push('Serviço de marcenaria');
        break;
      case 'pequena-obra':
        basePrice = 300;
        minPrice = 200;
        maxPrice = 1000;
        factors.push('Pequena obra/demolição');
        break;
      case 'troca-piso':
        basePrice = 400;
        minPrice = 250;
        maxPrice = 1200;
        factors.push('Troca de piso/revestimento');
        break;
    }

    // Número de cômodos
    const comodos = this.getSelectedCount(filters, '2. Cômodo');
    if (comodos > 1) {
      basePrice *= 1.2 * comodos;
      minPrice *= 1.1 * comodos;
      maxPrice *= 1.3 * comodos;
      factors.push(`${comodos} cômodos`);
    }

    // Materiais
    const materiais = this.getSelectedValue(filters, '3. Materiais');
    if (materiais === 'profissional-traz') {
      basePrice *= 1.5;
      minPrice *= 1.4;
      maxPrice *= 1.6;
      factors.push('Materiais incluídos');
    }

    return {
      basePrice: Math.round(basePrice),
      minPrice: Math.round(minPrice),
      maxPrice: Math.round(maxPrice),
      factors,
      description: this.getConstrucaoDescription(tipoServico),
    };
  }

  private estimateMontagemPrice(filters: any): PriceEstimation {
    let basePrice = 80;
    let minPrice = 50;
    let maxPrice = 300;
    const factors: string[] = [];

    // Tipo e quantidade de itens
    const itens = this.getSelectedCount(filters, '1. Tipo de Item');
    basePrice += itens * 40;
    minPrice += itens * 30;
    maxPrice += itens * 60;
    factors.push(`${itens} itens para montagem`);

    // Estado do Item
    const estado = this.getSelectedValue(filters, '2. Estado do Item');
    if (estado === 'parcialmente-desmontado') {
      basePrice *= 0.9;
      factors.push('Item parcialmente desmontado');
    } else if (estado === 'montado-ajustar') {
      basePrice *= 0.7;
      factors.push('Ajustes em item montado');
    }

    // Materiais
    const materiais = this.getSelectedValue(filters, '3. Materiais');
    if (materiais === 'profissional-traz') {
      basePrice *= 1.3;
      minPrice *= 1.2;
      maxPrice *= 1.4;
      factors.push('Materiais incluídos');
    }

    return {
      basePrice: Math.round(basePrice),
      minPrice: Math.round(minPrice),
      maxPrice: Math.round(maxPrice),
      factors,
      description: 'Montagem e instalação profissional',
    };
  }

  private estimateJardimPrice(filters: any): PriceEstimation {
    let basePrice = 120;
    let minPrice = 80;
    let maxPrice = 500;
    const factors: string[] = [];

    // Tipo de Serviço
    const tipos = this.getSelectedValues(filters, '1. Tipo de Serviço');
    tipos.forEach((tipo) => {
      switch (tipo) {
        case 'corte-grama':
          basePrice += 60;
          break;
        case 'poda-plantas':
          basePrice += 80;
          break;
        case 'limpeza-jardim':
          basePrice += 70;
          break;
        case 'manutencao-piscina':
          basePrice += 150;
          break;
      }
    });
    factors.push(`${tipos.length} serviços de jardim`);

    // Tamanho da Área
    const tamanho = this.getSelectedValue(filters, '2. Tamanho da Área');
    switch (tamanho) {
      case 'media':
        basePrice *= 1.5;
        factors.push('Área média (50-150m²)');
        break;
      case 'grande':
        basePrice *= 2.2;
        factors.push('Área grande (+150m²)');
        break;
      default:
        factors.push('Área pequena (até 50m²)');
    }

    // Equipamentos
    const equipamentos = this.getSelectedValue(filters, '3. Equipamentos');
    if (equipamentos === 'profissional-traz') {
      basePrice *= 1.4;
      factors.push('Equipamentos incluídos');
    }

    return {
      basePrice: Math.round(basePrice),
      minPrice: Math.round(minPrice),
      maxPrice: Math.round(maxPrice),
      factors,
      description: 'Serviços de jardinagem e piscina',
    };
  }

  // Métodos auxiliares
  private getSelectedValue(filters: any, categoryTitle: string): string {
    if (!filters[categoryTitle]) return '';
    return filters[categoryTitle][0]?.value || '';
  }

  private getSelectedValues(filters: any, categoryTitle: string): string[] {
    if (!filters[categoryTitle]) return [];
    return filters[categoryTitle].map((item: any) => item.value);
  }

  private getSelectedCount(filters: any, categoryTitle: string): number {
    if (!filters[categoryTitle]) return 0;
    return filters[categoryTitle].length;
  }

  private getDefaultPrice(): PriceEstimation {
    return {
      basePrice: 100,
      minPrice: 50,
      maxPrice: 300,
      factors: ['Serviço padrão'],
      description: 'Estimativa base para serviços gerais',
    };
  }

  private getReparosDescription(tipo: string): string {
    const descriptions: { [key: string]: string } = {
      eletrica: 'Reparos elétricos residenciais',
      hidraulica: 'Serviços hidráulicos especializados',
      'pequenos-consertos': 'Pequenos reparos e ajustes',
      'instalacao-equipamentos': 'Instalação de equipamentos',
    };
    return descriptions[tipo] || 'Serviços de reparo e manutenção';
  }

  private getLimpezaDescription(tipo: string): string {
    const descriptions: { [key: string]: string } = {
      'faxina-residencial': 'Faxina residencial completa',
      'pos-obra': 'Limpeza pós-obra especializada',
      'limpeza-pesada': 'Limpeza pesada e detalhada',
      'higienizacao-estofados': 'Higienização profissional de estofados',
    };
    return descriptions[tipo] || 'Serviços de limpeza e higienização';
  }

  private getConstrucaoDescription(tipo: string): string {
    const descriptions: { [key: string]: string } = {
      pintura: 'Serviços de pintura profissional',
      marcenaria: 'Trabalhos em marcenaria',
      'pequena-obra': 'Pequenas obras e reformas',
      'troca-piso': 'Instalação e troca de pisos',
    };
    return descriptions[tipo] || 'Serviços de reforma e construção';
  }
}
