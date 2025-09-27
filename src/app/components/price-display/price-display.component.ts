import { Component, Input, OnInit } from '@angular/core';
import {
  PriceEstimation,
  PriceEstimationService,
} from 'src/app/services/price-estimation.service';
@Component({
  selector: 'app-price-display',
  templateUrl: './price-display.component.html',
  styleUrls: ['./price-display.component.css'],
})
export class PriceDisplayComponent implements OnInit {
  @Input() serviceType!: string;
  @Input() selectedFilters!: any;

  priceEstimation?: PriceEstimation;
  isLoading = false;

  constructor(private priceService: PriceEstimationService) {}

  ngOnInit() {
    this.calculateEstimation();
  }

  ngOnChanges() {
    this.calculateEstimation();
  }

  private calculateEstimation() {
    if (this.serviceType && this.selectedFilters) {
      this.isLoading = true;

      // Simula um pequeno delay para parecer mais natural
      setTimeout(() => {
        this.priceEstimation = this.priceService.getPriceEstimation(
          this.serviceType,
          this.selectedFilters
        );
        this.isLoading = false;
      }, 500);
    }
  }

  getServiceTypeName(): string {
    const names: { [key: string]: string } = {
      reparos: 'Reparos e Manutenção',
      limpeza: 'Limpeza e Higienização',
      construcao: 'Reformas e Construção',
      montagem: 'Montagem e Instalação',
      jardim: 'Jardim e Piscina',
      outros: 'Outros Serviços',
    };
    return names[this.serviceType] || 'Serviço';
  }
}
