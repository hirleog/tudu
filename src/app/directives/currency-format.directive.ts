import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCurrencyFormat]',
})
export class CurrencyFormatDirective {
  private locale = 'pt-BR'; // Define o formato local para reais
  private currency = 'BRL';

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    // Remove caracteres não numéricos
    let numericValue = value.replace(/\D/g, '');

    // Se o campo estiver vazio, limpa o valor e retorna
    if (!numericValue) {
      this.el.nativeElement.value = '';
      return;
    }

    // Converte para número e aplica formatação
    let formattedValue = new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency: this.currency,
    }).format(parseInt(numericValue, 10) / 100);

    // Remove o espaço entre "R$" e o valor
    formattedValue = formattedValue.replace(/\s/g, '');

    // Atualiza o valor do campo com a formatação
    this.el.nativeElement.value = formattedValue;
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value: string) {
    // Se o campo estiver vazio ao perder o foco, define como R$0,00
    if (!value) {
      this.el.nativeElement.value = 'R$0,00';
    }
  }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value: string) {
    // Se o campo estiver vazio ou contiver "R$0,00", esvazia para facilitar a edição
    if (value === 'R$0,00') {
      this.el.nativeElement.value = '';
    }
  }
}
